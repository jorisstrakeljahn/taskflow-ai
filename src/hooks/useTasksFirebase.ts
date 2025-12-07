/**
 * useTasks Hook with Firebase Integration
 * 
 * This is the Firebase version of useTasks.
 * It uses Firestore for persistence and real-time updates.
 * 
 * Migration path:
 * 1. Start with this hook alongside useTasks
 * 2. Switch App.tsx to use this hook when ready
 * 3. Remove old useTasks.ts
 */

import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { createTask as createTaskUtil, updateTaskStatus } from '../utils/taskUtils';
import { useAuth } from '../contexts/AuthContext';
import * as taskService from '../services/taskService';

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
    console.log('Setting up Firestore subscription for userId:', userId);

    // Subscribe to real-time updates
    const unsubscribe = taskService.subscribeToTasks(userId, (updatedTasks) => {
      console.log('Firestore update received:', updatedTasks.length, 'tasks');
      setTasks(updatedTasks);
      setIsLoading(false);
    });

    // Error handling for subscription
    // Note: onSnapshot doesn't have a direct error callback,
    // but errors will appear in the console

    return () => {
      console.log('Unsubscribing from Firestore updates');
      unsubscribe();
    };
  }, [userId, authLoading]);

  const addTask = useCallback(
    async (title: string, group: string = 'General', parentId?: string) => {
      if (!userId) {
        const error = new Error('User must be authenticated');
        console.error('addTask error:', error);
        throw error;
      }

      console.log('addTask called:', { title, group, parentId, userId });

      const newTask = createTaskUtil(title, userId, group, parentId);
      
      // Set order to the end of root tasks (only for root tasks, not subtasks)
      let order = 0;
      if (!parentId) {
        const rootTasks = tasks.filter((t) => !t.parentId);
        const maxOrder = rootTasks.length > 0 
          ? Math.max(...rootTasks.map((t) => t.order ?? 0))
          : -1;
        order = maxOrder + 1;
      }
      
      const taskWithOrder = { ...newTask, order };
      console.log('Task prepared for Firestore:', taskWithOrder);
      
      try {
        // Create task in Firestore (returns the Firestore document ID)
        const firestoreId = await taskService.createTask(taskWithOrder);
        console.log('Task created in Firestore with ID:', firestoreId);
        
        // Create task object with Firestore ID
        const taskWithFirestoreId = { ...taskWithOrder, id: firestoreId };
        
        // Note: Real-time listener will update the state automatically
        // But we can do optimistic update for immediate UI feedback
        setTasks((prev) => {
          // Check if task already exists (from real-time update)
          if (prev.some((t) => t.id === firestoreId)) {
            return prev;
          }
          return [...prev, taskWithFirestoreId];
        });
        
        return taskWithFirestoreId;
      } catch (error) {
        console.error('Error in addTask:', error);
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
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        )
      );

      try {
        await taskService.updateTask(id, updates);
      } catch (error) {
        // Reload tasks on error
        const reloadedTasks = await taskService.getTasks(userId);
        setTasks(reloadedTasks);
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
      const taskToDelete = tasks.find((t) => t.id === id);
      setTasks((prev) => prev.filter((task) => task.id !== id && task.parentId !== id));

      try {
        await taskService.deleteTaskWithSubtasks(id, tasks);
      } catch (error) {
        // Reload tasks on error
        const reloadedTasks = await taskService.getTasks(userId);
        setTasks(reloadedTasks);
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
        // Reload tasks on error
        const reloadedTasks = await taskService.getTasks(userId);
        setTasks(reloadedTasks);
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

