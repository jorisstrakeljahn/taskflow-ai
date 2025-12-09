/**
 * Custom hook for task-related business logic
 *
 * Separates business logic from UI components. Provides handlers for creating tasks,
 * subtasks, adding multiple tasks from AI suggestions, and reactivating completed tasks.
 * Handles parent-child relationships and task creation with optional metadata.
 *
 * @param addTask - Function to create a new task in Firestore
 * @param updateTask - Function to update an existing task
 * @param changeTaskStatus - Function to change a task's status
 * @returns Object containing task creation and management handlers
 *
 * @example
 * ```tsx
 * const { handleCreateTask, handleAddTasks } = useTaskHandlers({
 *   addTask: createTaskInFirestore,
 *   updateTask: updateTaskInFirestore,
 *   changeTaskStatus: changeStatusInFirestore
 * });
 * ```
 */

import { useCallback } from 'react';
import { Task as TaskType, TaskPriority } from '../types/task';
import { ParsedTask } from '../services/openaiService';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './useToast';

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
  dueDate?: Date;
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
  const toast = useToast();

  /**
   * Create a task with optional description, priority, and due date
   *
   * @param title - Task title
   * @param group - Task group/category
   * @param parentId - Optional parent task ID for subtasks
   * @param description - Optional task description
   * @param priority - Optional task priority (low, medium, high)
   * @param dueDate - Optional due date
   * @returns The created task
   */
  const createTaskWithDetails = useCallback(
    async (
      title: string,
      group: string,
      parentId: string | undefined,
      description?: string,
      priority?: TaskPriority,
      dueDate?: Date
    ) => {
      const newTask = await addTask(title, group, parentId);
      if (description || priority || dueDate) {
        await updateTask(newTask.id, {
          description,
          priority,
          dueDate,
        });
      }
      return newTask as TaskType;
    },
    [addTask, updateTask]
  );

  /**
   * Handle creating a subtask
   *
   * @param data - Task data including title, group, parentId, description, and priority
   * @throws Error if task creation fails
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
            data.priority,
            data.dueDate
          );
          toast.success(t('toast.subtaskCreated'));
        }
      } catch (error) {
        logger.error('Error creating subtask:', error);
        const errorMessage = error instanceof Error ? error.message : t('toast.errorCreatingTask');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [createTaskWithDetails, t, toast]
  );

  /**
   * Handle creating a root task (not a subtask)
   *
   * @param data - Task data including title, group, description, and priority
   * @throws Error if task creation fails
   */
  const handleCreateTask = useCallback(
    async (data: CreateTaskData) => {
      try {
        await createTaskWithDetails(
          data.title,
          data.group,
          undefined,
          data.description,
          data.priority,
          data.dueDate
        );
        toast.success(t('toast.taskCreated'));
      } catch (error) {
        logger.error('Error creating task:', error);
        const errorMessage = error instanceof Error ? error.message : t('toast.errorCreatingTask');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [createTaskWithDetails, t, toast]
  );

  /**
   * Handle adding multiple tasks from AI suggestions
   *
   * Supports parent-child relationships via parentId (task title reference).
   * Creates parent tasks first, then maps parent titles to IDs for subtasks.
   * Falls back to finding existing parent tasks if not in the current batch.
   *
   * @param parsedTasks - Array of parsed tasks from AI, may include parent-child relationships
   * @param existingTasks - Optional array of existing tasks for parent lookup
   * @throws Error if task creation fails
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
          const taskDueDate = task.dueDate ? new Date(task.dueDate) : undefined;
          const newTask = await createTaskWithDetails(
            task.title,
            task.group,
            undefined,
            task.description,
            task.priority,
            taskDueDate
          );
          taskTitleToId.set(task.title, newTask.id);
          tasksToCreate.push({ task, parentId: undefined });
        }

        // Create subtasks with parent ID mapping
        for (const subtask of subtasks) {
          const parentId = taskTitleToId.get(subtask.parentId!);
          const subtaskDueDate = subtask.dueDate ? new Date(subtask.dueDate) : undefined;
          if (parentId) {
            const newSubtask = await createTaskWithDetails(
              subtask.title,
              subtask.group,
              parentId,
              subtask.description,
              subtask.priority,
              subtaskDueDate
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
                subtask.priority,
                subtaskDueDate
              );
            } else {
              logger.warn(
                `Parent task "${subtask.parentId}" not found for subtask "${subtask.title}"`
              );
            }
          }
        }
        const count = parsedTasks.length;
        toast.success(t('toast.tasksAdded', { count }));
      } catch (error) {
        logger.error('Error adding tasks:', error);
        toast.error(t('toast.errorGeneratingTasks'));
        throw error;
      }
    },
    [createTaskWithDetails, t, toast]
  );

  /**
   * Handle reactivating a completed task
   *
   * Changes task status from 'done' to 'open' to make it active again.
   *
   * @param id - Task ID to reactivate
   */
  const handleReactivateTask = useCallback(
    (id: string) => {
      changeTaskStatus(id, 'open');
      toast.success(t('toast.taskReactivated'));
    },
    [changeTaskStatus, toast, t]
  );

  return {
    createTaskWithDetails,
    handleCreateSubtask,
    handleCreateTask,
    handleAddTasks,
    handleReactivateTask,
  };
};
