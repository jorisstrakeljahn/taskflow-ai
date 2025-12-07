import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { createTask, updateTaskStatus } from '../utils/taskUtils';
import { parseTaskDatesArray } from '../utils/dateUtils';

const STORAGE_KEY = 'taskflow-tasks';
const DEFAULT_USER_ID = 'user-1'; // TODO: Replace with actual auth

const loadSampleTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch('/sample-tasks.json');
    const data = await response.json();
    return parseTaskDatesArray(data);
  } catch (error) {
    console.error('Error loading sample tasks:', error);
    return [];
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const loadedTasks = parseTaskDatesArray(parsed);
          // Initialize order for tasks that don't have it
          const tasksWithOrder = loadedTasks.map((task, index) => ({
            ...task,
            order: task.order !== undefined ? task.order : index,
          }));
          setTasks(tasksWithOrder);
        } catch (error) {
          console.error('Error parsing stored tasks:', error);
          // Fallback to sample tasks
          const sample = await loadSampleTasks();
          const tasksWithOrder = sample.map((task, index) => ({
            ...task,
            order: index,
          }));
          setTasks(tasksWithOrder);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksWithOrder));
        }
      } else {
        // Load sample tasks if localStorage is empty
        const sample = await loadSampleTasks();
        const tasksWithOrder = sample.map((task, index) => ({
          ...task,
          order: index,
        }));
        setTasks(tasksWithOrder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksWithOrder));
      }
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  }, []);

  const addTask = useCallback(
    (title: string, group: string = 'General', parentId?: string) => {
      const newTask = createTask(title, DEFAULT_USER_ID, group, parentId);
      // Set order to the end of root tasks (or subtasks if parentId exists)
      const rootTasks = tasks.filter((t) => !t.parentId);
      const maxOrder = rootTasks.length > 0 
        ? Math.max(...rootTasks.map((t) => t.order ?? 0))
        : -1;
      const taskWithOrder = { ...newTask, order: maxOrder + 1 };
      const newTasks = [...tasks, taskWithOrder];
      saveTasks(newTasks);
      return taskWithOrder;
    },
    [tasks, saveTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const newTasks = tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      );
      saveTasks(newTasks);
    },
    [tasks, saveTasks]
  );

  const changeTaskStatus = useCallback(
    (id: string, status: TaskStatus) => {
      const newTasks = tasks.map((task) =>
        task.id === id ? updateTaskStatus(task, status) : task
      );
      saveTasks(newTasks);
    },
    [tasks, saveTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      // Also delete all subtasks
      const newTasks = tasks.filter(
        (task) => task.id !== id && task.parentId !== id
      );
      saveTasks(newTasks);
    },
    [tasks, saveTasks]
  );

  const reorderTasks = useCallback(
    (activeId: string, overId: string) => {
      const activeTask = tasks.find((t) => t.id === activeId);
      const overTask = tasks.find((t) => t.id === overId);
      
      if (!activeTask || !overTask || activeTask.parentId || overTask.parentId) {
        return; // Only allow reordering root tasks
      }

      const rootTasks = tasks.filter((t) => !t.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const activeIndex = rootTasks.findIndex((t) => t.id === activeId);
      const overIndex = rootTasks.findIndex((t) => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      const newRootTasks = [...rootTasks];
      const [removed] = newRootTasks.splice(activeIndex, 1);
      newRootTasks.splice(overIndex, 0, removed);

      // Update order values
      const updatedTasks = tasks.map((task) => {
        if (task.parentId) return task; // Keep subtasks unchanged
        
        const newIndex = newRootTasks.findIndex((t) => t.id === task.id);
        if (newIndex !== -1) {
          return { ...task, order: newIndex, updatedAt: new Date() };
        }
        return task;
      });

      saveTasks(updatedTasks);
    },
    [tasks, saveTasks]
  );

  const resetToSampleTasks = useCallback(async () => {
    const sample = await loadSampleTasks();
    const tasksWithOrder = sample.map((task, index) => ({
      ...task,
      order: index,
    }));
    saveTasks(tasksWithOrder);
  }, [saveTasks]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    changeTaskStatus,
    deleteTask,
    reorderTasks,
    resetToSampleTasks,
  };
};

