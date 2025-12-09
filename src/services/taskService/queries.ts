/**
 * Task Queries
 *
 * Functions for querying tasks from Firestore.
 * Handles fetching and real-time subscriptions.
 */

import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Task } from '../../types/task';
import { logger } from '../../utils/logger';
import { firestoreToTask, sortTasksByOrder } from './converters';

const TASKS_COLLECTION = 'tasks';

/**
 * Get all tasks for a user
 *
 * Fetches all tasks from Firestore for the specified user and returns them sorted by order.
 *
 * @param userId - User ID to fetch tasks for
 * @returns Array of tasks sorted by order
 * @throws Error if Firestore query fails
 */
export const getTasks = async (userId: string): Promise<Task[]> => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const q = query(tasksRef, where('userId', '==', userId));

  try {
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => firestoreToTask(doc.data(), doc.id));
    return sortTasksByOrder(tasks);
  } catch (error) {
    logger.error('Error fetching tasks from Firestore:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time task updates for a user
 *
 * Sets up a real-time listener that calls the callback whenever tasks change.
 * Returns an unsubscribe function to stop listening.
 *
 * @param userId - User ID to subscribe to tasks for
 * @param callback - Function to call with updated tasks array
 * @returns Unsubscribe function to stop the listener
 */
export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
): Unsubscribe => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  // Sort in memory because order might be undefined for some tasks
  const q = query(tasksRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const tasks = snapshot.docs.map((doc) => firestoreToTask(doc.data(), doc.id));
      const sortedTasks = sortTasksByOrder(tasks);
      callback(sortedTasks);
    },
    (error) => {
      logger.error('Error in task subscription:', error);
      callback([]); // Return empty array on error
    }
  );
};
