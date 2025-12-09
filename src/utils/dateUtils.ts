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
    dueDate: task.dueDate ? new Date(task.dueDate as string | number | Date) : undefined,
  } as Task;
};

/**
 * Convert an array of tasks with date strings to Date objects
 */
export const parseTaskDatesArray = (tasks: Record<string, unknown>[]): Task[] => {
  return tasks.map(parseTaskDates);
};

/**
 * Format a date to a readable string
 *
 * @param date - Date object to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

/**
 * Format a date with time
 *
 * @param date - Date object to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 *
 * @param date - Date object
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 60) {
    return diffInSeconds < 0 ? 'in a few seconds' : 'just now';
  }

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(absDiff / interval.seconds);
    if (count >= 1) {
      const plural = count !== 1 ? 's' : '';
      return diffInSeconds < 0
        ? `in ${count} ${interval.label}${plural}`
        : `${count} ${interval.label}${plural} ago`;
    }
  }

  return 'just now';
};

/**
 * Format date for input field (YYYY-MM-DD)
 *
 * @param date - Date object
 * @returns ISO date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if a date is today
 *
 * @param date - Date object
 * @returns True if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate.getTime() === today.getTime();
};

/**
 * Check if a date is overdue
 *
 * @param date - Date object
 * @returns True if date is in the past
 */
export const isOverdue = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};
