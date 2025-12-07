import { Task } from '../types/task';

/**
 * Convert date strings from JSON to Date objects
 */
export const parseTaskDates = (task: Record<string, unknown>): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt as string | number | Date),
    updatedAt: new Date(task.updatedAt as string | number | Date),
    completedAt: task.completedAt
      ? new Date(task.completedAt as string | number | Date)
      : undefined,
  } as Task;
};

/**
 * Convert an array of tasks with date strings to Date objects
 */
export const parseTaskDatesArray = (tasks: Record<string, unknown>[]): Task[] => {
  return tasks.map(parseTaskDates);
};
