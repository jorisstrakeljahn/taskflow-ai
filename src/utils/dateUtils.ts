import { Task } from '../types/task';

/**
 * Convert date strings from JSON to Date objects
 */
export const parseTaskDates = (task: any): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  };
};

/**
 * Convert an array of tasks with date strings to Date objects
 */
export const parseTaskDatesArray = (tasks: any[]): Task[] => {
  return tasks.map(parseTaskDates);
};

