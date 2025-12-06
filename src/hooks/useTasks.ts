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
          setTasks(loadedTasks);
        } catch (error) {
          console.error('Error parsing stored tasks:', error);
          // Fallback to sample tasks
          const sample = await loadSampleTasks();
          setTasks(sample);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
        }
      } else {
        // Load sample tasks if localStorage is empty
        const sample = await loadSampleTasks();
        setTasks(sample);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
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
      const newTasks = [...tasks, newTask];
      saveTasks(newTasks);
      return newTask;
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

  const resetToSampleTasks = useCallback(async () => {
    const sample = await loadSampleTasks();
    saveTasks(sample);
  }, [saveTasks]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    changeTaskStatus,
    deleteTask,
    resetToSampleTasks,
  };
};

