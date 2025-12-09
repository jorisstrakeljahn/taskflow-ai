import { Task, TaskStatus, TaskPriority } from '../types/task';
import {
  validateTaskTitle,
  validateTaskDescription,
  validateTaskGroup,
  sanitizeString,
} from './inputValidation';

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
  dueDate?: Date;
}

export interface EditTaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  group: string;
  priority?: TaskPriority;
  dueDate?: Date;
}

/**
 * Prepares task data for creation with validation and sanitization
 *
 * @param data - Raw task data from form
 * @returns Validated and sanitized task data
 * @throws Error if validation fails
 */
export const prepareCreateTaskData = (data: CreateTaskData) => {
  // Validate and sanitize title
  const titleValidation = validateTaskTitle(data.title);
  if (!titleValidation.isValid) {
    throw new Error(titleValidation.error || 'Invalid task title');
  }

  // Validate and sanitize description if provided
  if (data.description) {
    const descValidation = validateTaskDescription(data.description);
    if (!descValidation.isValid) {
      throw new Error(descValidation.error || 'Invalid task description');
    }
  }

  // Validate and sanitize group
  const groupValidation = validateTaskGroup(data.group);
  if (!groupValidation.isValid) {
    throw new Error(groupValidation.error || 'Invalid task group');
  }

  return {
    title: sanitizeString(data.title.trim(), 200),
    description: data.description ? sanitizeString(data.description.trim(), 2000) : undefined,
    group: sanitizeString(data.group.trim(), 50),
    priority: data.priority,
    parentId: data.parentId,
    dueDate: data.dueDate,
  };
};

/**
 * Prepares task data for editing with validation and sanitization
 *
 * @param currentTask - Current task being edited
 * @param data - Raw task data from form
 * @returns Validated and sanitized task data
 * @throws Error if validation fails
 */
export const prepareEditTaskData = (currentTask: Task | undefined, data: EditTaskData) => {
  // Validate and sanitize title
  const titleValidation = validateTaskTitle(data.title);
  if (!titleValidation.isValid) {
    throw new Error(titleValidation.error || 'Invalid task title');
  }

  // Validate and sanitize description if provided
  if (data.description) {
    const descValidation = validateTaskDescription(data.description);
    if (!descValidation.isValid) {
      throw new Error(descValidation.error || 'Invalid task description');
    }
  }

  // Validate and sanitize group
  const groupValidation = validateTaskGroup(data.group);
  if (!groupValidation.isValid) {
    throw new Error(groupValidation.error || 'Invalid task group');
  }

  const statusChangedToDone = data.status === 'done' && currentTask?.status !== 'done';
  const statusChangedFromDone = data.status !== 'done' && currentTask?.status === 'done';

  return {
    title: sanitizeString(data.title.trim(), 200),
    description: data.description ? sanitizeString(data.description.trim(), 2000) : undefined,
    status: data.status,
    group: sanitizeString(data.group.trim(), 50),
    priority: data.priority,
    dueDate: data.dueDate,
    completedAt: statusChangedToDone
      ? new Date()
      : statusChangedFromDone
        ? undefined
        : currentTask?.completedAt,
  };
};
