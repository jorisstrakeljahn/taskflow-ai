/**
 * Task Service
 *
 * Main entry point for task-related Firestore operations.
 * Re-exports all functions from sub-modules for backward compatibility.
 */

// Converters
export { timestampToDate, taskToFirestore, firestoreToTask, sortTasksByOrder } from './converters';

// Queries
export { getTasks, subscribeToTasks } from './queries';

// Mutations
export { createTask, updateTask, deleteTask, deleteTaskWithSubtasks } from './mutations';
