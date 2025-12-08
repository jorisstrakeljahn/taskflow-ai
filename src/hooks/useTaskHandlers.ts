/**
 * Custom hook for task-related business logic
 * Separates business logic from UI components
 */

import { useCallback } from 'react';
import { Task, TaskPriority } from '../types/task';
import { ParsedTask } from '../services/openaiService';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';

interface UseTaskHandlersProps {
  addTask: (title: string, group: string, parentId?: string) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  changeTaskStatus: (id: string, status: Task['status']) => Promise<void>;
}

interface CreateTaskData {
  title: string;
  group: string;
  parentId?: string;
  description?: string;
  priority?: TaskPriority;
}

/**
 * Hook for task creation and management handlers
 */
export const useTaskHandlers = ({
  addTask,
  updateTask,
  changeTaskStatus,
}: UseTaskHandlersProps) => {
  const { t } = useLanguage();

  /**
   * Create a task with optional description and priority
   */
  const createTaskWithDetails = useCallback(
    async (
      title: string,
      group: string,
      parentId: string | undefined,
      description?: string,
      priority?: TaskPriority
    ) => {
      const newTask = await addTask(title, group, parentId);
      if (description || priority) {
        await updateTask(newTask.id, {
          description,
          priority,
        });
      }
      return newTask;
    },
    [addTask, updateTask]
  );

  /**
   * Handle creating a subtask
   */
  const handleCreateSubtask = useCallback(
    async (data: CreateTaskData) => {
      try {
        if (data.parentId) {
          await createTaskWithDetails(
            data.title,
            data.group,
            data.parentId,
            data.description,
            data.priority
          );
        }
      } catch (error) {
        logger.error('Error creating subtask:', error);
        const errorMessage = error instanceof Error ? error.message : t('task.createError');
        throw new Error(errorMessage);
      }
    },
    [createTaskWithDetails, t]
  );

  /**
   * Handle creating a root task
   */
  const handleCreateTask = useCallback(
    async (data: CreateTaskData) => {
      try {
        await createTaskWithDetails(
          data.title,
          data.group,
          undefined,
          data.description,
          data.priority
        );
      } catch (error) {
        logger.error('Error creating task:', error);
        const errorMessage = error instanceof Error ? error.message : t('task.createError');
        throw new Error(errorMessage);
      }
    },
    [createTaskWithDetails, t]
  );

  /**
   * Handle adding multiple tasks from AI suggestions
   */
  const handleAddTasks = useCallback(
    async (parsedTasks: ParsedTask[]) => {
      try {
        for (const task of parsedTasks) {
          await createTaskWithDetails(
            task.title,
            task.group,
            undefined,
            task.description,
            task.priority
          );
        }
      } catch (error) {
        logger.error('Error adding tasks:', error);
        throw error;
      }
    },
    [createTaskWithDetails]
  );

  /**
   * Handle reactivating a completed task
   */
  const handleReactivateTask = useCallback(
    (id: string) => {
      changeTaskStatus(id, 'open');
    },
    [changeTaskStatus]
  );

  return {
    createTaskWithDetails,
    handleCreateSubtask,
    handleCreateTask,
    handleAddTasks,
    handleReactivateTask,
  };
};
