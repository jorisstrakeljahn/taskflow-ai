/**
 * useTasks Hook with Firebase Integration
 *
 * Manages task state and operations using Firestore for persistence
 * and real-time synchronization across devices.
 */

import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { createTask as createTaskUtil, updateTaskStatus } from '../utils/taskUtils';
import { useAuth } from '../contexts/AuthContext';
import * as taskService from '../services/taskService';
import { logger } from '../utils/logger';

/**
 * Calculate the next order value for a new root task
 */
const calculateNextOrder = (tasks: Task[]): number => {
  const rootTasks = tasks.filter((t) => !t.parentId);
  if (rootTasks.length === 0) return 0;
  const maxOrder = Math.max(...rootTasks.map((t) => t.order ?? 0));
  return maxOrder + 1;
};

/**
 * Reload tasks from Firestore on error
 */
const reloadTasksOnError = async (
  userId: string,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
): Promise<void> => {
  try {
    const reloadedTasks = await taskService.getTasks(userId);
    setTasks(reloadedTasks);
  } catch (reloadError) {
    logger.error('Error reloading tasks:', reloadError);
  }
};

export const useTasksFirebase = () => {
  const { userId, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to real-time task updates
  useEffect(() => {
    if (!userId || authLoading) {
      setIsLoading(authLoading);
      setTasks([]); // Clear tasks when user logs out
      return;
    }

    setIsLoading(true);
    logger.log('Setting up Firestore subscription for userId:', userId);

    // Subscribe to real-time updates
    const unsubscribe = taskService.subscribeToTasks(userId, (updatedTasks) => {
      logger.log('Firestore update received:', updatedTasks.length, 'tasks');
      setTasks(updatedTasks);
      setIsLoading(false);
    });

    return () => {
      logger.log('Unsubscribing from Firestore updates');
      unsubscribe();
    };
  }, [userId, authLoading]);

  const addTask = useCallback(
    async (title: string, group: string = 'General', parentId?: string) => {
      if (!userId) {
        const error = new Error('User must be authenticated');
        logger.error('addTask error:', error);
        throw error;
      }

      logger.log('addTask called:', { title, group, parentId, userId });

      const newTask = createTaskUtil(title, userId, group, parentId);

      // Set order to the end of root tasks (only for root tasks, not subtasks)
      const order = !parentId ? calculateNextOrder(tasks) : undefined;

      const taskWithOrder = { ...newTask, order };
      logger.log('Task prepared for Firestore:', taskWithOrder);

      try {
        // Create task in Firestore (returns the Firestore document ID)
        const firestoreId = await taskService.createTask(taskWithOrder);
        logger.log('Task created in Firestore with ID:', firestoreId);

        // Create task object with Firestore ID
        const taskWithFirestoreId = { ...taskWithOrder, id: firestoreId };

        // Optimistic update for immediate UI feedback
        // Real-time listener will update the state automatically
        setTasks((prev) => {
          if (prev.some((t) => t.id === firestoreId)) {
            return prev; // Task already exists from real-time update
          }
          return [...prev, taskWithFirestoreId];
        });

        return taskWithFirestoreId;
      } catch (error) {
        logger.error('Error in addTask:', error);
        throw error;
      }
    },
    [tasks, userId]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      if (!userId) throw new Error('User must be authenticated');

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task))
      );

      try {
        await taskService.updateTask(id, updates);
      } catch (error) {
        await reloadTasksOnError(userId, setTasks);
        throw error;
      }
    },
    [userId]
  );

  const changeTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = updateTaskStatus(task, status);
      await updateTask(id, updatedTask);
    },
    [tasks, updateTask]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!userId) throw new Error('User must be authenticated');

      // Optimistic update
      setTasks((prev) => prev.filter((task) => task.id !== id && task.parentId !== id));

      try {
        await taskService.deleteTaskWithSubtasks(id, tasks);
      } catch (error) {
        await reloadTasksOnError(userId, setTasks);
        throw error;
      }
    },
    [tasks, userId]
  );

  const reorderTasks = useCallback(
    async (activeId: string, overId: string) => {
      if (!userId) throw new Error('User must be authenticated');

      const activeTask = tasks.find((t) => t.id === activeId);
      const overTask = tasks.find((t) => t.id === overId);

      if (!activeTask || !overTask || activeTask.parentId || overTask.parentId) {
        return; // Only allow reordering root tasks
      }

      const rootTasks = tasks
        .filter((t) => !t.parentId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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

      // Optimistic update
      setTasks(updatedTasks);

      // Update all tasks with new order
      try {
        await Promise.all(
          updatedTasks
            .filter((t) => !t.parentId)
            .map((task) => taskService.updateTask(task.id, { order: task.order }))
        );
      } catch (error) {
        await reloadTasksOnError(userId, setTasks);
        throw error;
      }
    },
    [tasks, userId]
  );

  return {
    tasks,
    isLoading: isLoading || authLoading,
    addTask,
    updateTask,
    changeTaskStatus,
    deleteTask,
    reorderTasks,
  };
};
