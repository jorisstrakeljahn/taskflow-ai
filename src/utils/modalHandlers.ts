import { Task, TaskStatus, TaskPriority } from '../types/task';

/**
 * Utility functions for handling task-related modal operations
 */

export interface CreateTaskData {
  title: string;
  description?: string;
  group: string;
  priority?: TaskPriority;
  parentId?: string;
  status?: TaskStatus;
}

export interface EditTaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  group: string;
  priority?: TaskPriority;
}

/**
 * Prepares task data for creation
 */
export const prepareCreateTaskData = (data: CreateTaskData) => {
  return {
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    group: data.group,
    priority: data.priority,
    parentId: data.parentId,
  };
};

/**
 * Prepares task data for editing, including status change logic
 */
export const prepareEditTaskData = (
  currentTask: Task | undefined,
  data: EditTaskData
) => {
  const statusChangedToDone = data.status === 'done' && currentTask?.status !== 'done';
  const statusChangedFromDone = data.status !== 'done' && currentTask?.status === 'done';

  return {
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    status: data.status,
    group: data.group,
    priority: data.priority,
    completedAt: statusChangedToDone 
      ? new Date() 
      : statusChangedFromDone 
        ? undefined 
        : currentTask?.completedAt,
  };
};

