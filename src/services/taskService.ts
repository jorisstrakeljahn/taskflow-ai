/**
 * Task Service
 * 
 * Handles all Firestore operations for tasks:
 * - Create, Read, Update, Delete
 * - Real-time subscriptions
 * - User-specific queries
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '../types/task';

const TASKS_COLLECTION = 'tasks';

/**
 * Convert Firestore Timestamp to Date
 */
const timestampToDate = (timestamp: Timestamp | Date | undefined): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

/**
 * Convert Task to Firestore format
 */
const taskToFirestore = (task: Task): DocumentData => {
  return {
    ...task,
    createdAt: task.createdAt ? Timestamp.fromDate(task.createdAt) : Timestamp.now(),
    updatedAt: task.updatedAt ? Timestamp.fromDate(task.updatedAt) : Timestamp.now(),
    completedAt: task.completedAt ? Timestamp.fromDate(task.completedAt) : null,
  };
};

/**
 * Convert Firestore document to Task
 */
const firestoreToTask = (docData: DocumentData, id: string): Task => {
  return {
    id,
    ...docData,
    createdAt: timestampToDate(docData.createdAt),
    updatedAt: timestampToDate(docData.updatedAt),
    completedAt: timestampToDate(docData.completedAt),
  } as Task;
};

/**
 * Get all tasks for a user
 */
export const getTasks = async (userId: string): Promise<Task[]> => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => firestoreToTask(doc.data(), doc.id));
};

/**
 * Subscribe to real-time task updates for a user
 */
export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
): Unsubscribe => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const tasks = snapshot.docs.map((doc) => firestoreToTask(doc.data(), doc.id));
    callback(tasks);
  });
};

/**
 * Create a new task
 * Returns the Firestore document ID
 */
export const createTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const taskData = taskToFirestore(task as Task);
  const docRef = await addDoc(tasksRef, taskData);
  // Firestore automatically generates the ID, which we use as the task ID
  return docRef.id;
};

/**
 * Update an existing task
 */
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const updateData: DocumentData = {
    ...updates,
    updatedAt: Timestamp.now(),
  };

  // Handle date fields
  if (updates.completedAt !== undefined) {
    updateData.completedAt = updates.completedAt
      ? Timestamp.fromDate(updates.completedAt)
      : null;
  }

  await updateDoc(taskRef, updateData);
};

/**
 * Delete a task (and optionally its subtasks)
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
};

/**
 * Delete a task and all its subtasks
 */
export const deleteTaskWithSubtasks = async (
  taskId: string,
  allTasks: Task[]
): Promise<void> => {
  // Get all subtask IDs
  const subtaskIds = allTasks
    .filter((task) => task.parentId === taskId)
    .map((task) => task.id);

  // Delete the main task
  await deleteTask(taskId);

  // Delete all subtasks
  await Promise.all(subtaskIds.map((id) => deleteTask(id)));
};

