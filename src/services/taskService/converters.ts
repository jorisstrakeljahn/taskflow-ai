/**
 * Task Converters
 *
 * Functions for converting between Task objects and Firestore DocumentData format.
 * Handles date/timestamp conversions and data sanitization.
 */

import { Timestamp, DocumentData } from 'firebase/firestore';
import { Task } from '../../types/task';

/**
 * Convert Firestore Timestamp to Date
 *
 * @param timestamp - Firestore Timestamp or Date object
 * @returns Date object or undefined
 */
export const timestampToDate = (timestamp: Timestamp | Date | undefined): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

/**
 * Convert Task to Firestore format
 *
 * Removes undefined values (Firestore doesn't accept undefined) and converts
 * Date objects to Firestore Timestamps.
 *
 * @param task - Task object to convert
 * @returns Firestore DocumentData object
 */
export const taskToFirestore = (task: Task): DocumentData => {
  const data: DocumentData = {
    title: task.title,
    status: task.status,
    group: task.group,
    userId: task.userId,
    createdAt: task.createdAt ? Timestamp.fromDate(task.createdAt) : Timestamp.now(),
    updatedAt: task.updatedAt ? Timestamp.fromDate(task.updatedAt) : Timestamp.now(),
    // Ensure order is always a number (default to 0 if undefined)
    order: task.order ?? 0,
  };

  // Only include optional fields if they have values (not undefined)
  if (task.description !== undefined && task.description !== null && task.description !== '') {
    data.description = task.description;
  }

  if (task.priority !== undefined && task.priority !== null) {
    data.priority = task.priority;
  }

  if (task.parentId !== undefined && task.parentId !== null) {
    data.parentId = task.parentId;
  }

  if (task.completedAt !== undefined && task.completedAt !== null) {
    data.completedAt = Timestamp.fromDate(task.completedAt);
  }

  if (task.dueDate !== undefined && task.dueDate !== null) {
    data.dueDate = Timestamp.fromDate(task.dueDate);
  }

  return data;
};

/**
 * Convert Firestore document to Task
 *
 * @param docData - Firestore document data
 * @param id - Document ID
 * @returns Task object
 */
export const firestoreToTask = (docData: DocumentData, id: string): Task => {
  return {
    id,
    title: docData.title,
    status: docData.status || 'open',
    group: docData.group || 'General',
    userId: docData.userId,
    description: docData.description || undefined,
    priority: docData.priority || undefined,
    parentId: docData.parentId || undefined,
    order: docData.order ?? 0,
    createdAt: timestampToDate(docData.createdAt) || new Date(),
    updatedAt: timestampToDate(docData.updatedAt) || new Date(),
    completedAt: timestampToDate(docData.completedAt),
    dueDate: timestampToDate(docData.dueDate),
  } as Task;
};

/**
 * Sort tasks by order (handles undefined orders)
 *
 * @param tasks - Array of tasks to sort
 * @returns Sorted array of tasks
 */
export const sortTasksByOrder = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });
};
