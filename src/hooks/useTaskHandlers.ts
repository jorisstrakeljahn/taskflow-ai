/**
 * Custom hook for task-related business logic
 * Separates business logic from UI components
 */

import { useCallback } from 'react';
import { Task as TaskType, TaskPriority } from '../types/task';
import { ParsedTask } from '../services/openaiService';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';

interface UseTaskHandlersProps {
  addTask: (title: string, group: string, parentId?: string) => Promise<TaskType>;
  updateTask: (id: string, updates: Partial<TaskType>) => Promise<void>;
  changeTaskStatus: (id: string, status: TaskType['status']) => Promise<void>;
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
      return newTask as TaskType;
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
   * Supports parent-child relationships via parentId (task title reference)
   */
  const handleAddTasks = useCallback(
    async (parsedTasks: ParsedTask[], existingTasks: TaskType[] = []) => {
      try {
        // First, create all parent tasks and store their IDs
        const taskTitleToId = new Map<string, string>();
        const tasksToCreate: Array<{ task: ParsedTask; parentId?: string }> = [];

        // Separate parent tasks and subtasks
        const parentTasks = parsedTasks.filter((task) => !task.parentId);
        const subtasks = parsedTasks.filter((task) => task.parentId);

        // Create parent tasks first
        for (const task of parentTasks) {
          const newTask = await createTaskWithDetails(
            task.title,
            task.group,
            undefined,
            task.description,
            task.priority
          );
          taskTitleToId.set(task.title, newTask.id);
          tasksToCreate.push({ task, parentId: undefined });
        }

        // Create subtasks with parent ID mapping
        for (const subtask of subtasks) {
          const parentId = taskTitleToId.get(subtask.parentId!);
          if (parentId) {
            const newSubtask = await createTaskWithDetails(
              subtask.title,
              subtask.group,
              parentId,
              subtask.description,
              subtask.priority
            );
            taskTitleToId.set(subtask.title, newSubtask.id);
            tasksToCreate.push({ task: subtask, parentId });
          } else {
            // Parent not found in this batch, try to find in existing tasks
            const existingParent = existingTasks.find((t) => t.title === subtask.parentId);
            if (existingParent) {
              await createTaskWithDetails(
                subtask.title,
                subtask.group,
                existingParent.id,
                subtask.description,
                subtask.priority
              );
            } else {
              logger.warn(
                `Parent task "${subtask.parentId}" not found for subtask "${subtask.title}"`
              );
            }
          }
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
