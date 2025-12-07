import { Task, TaskStatus } from '../types/task';

export const createTask = (
  title: string,
  userId: string,
  group: string = 'General',
  parentId?: string
): Task => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    title,
    status: 'open',
    group,
    parentId,
    createdAt: now,
    updatedAt: now,
    userId,
  };
};

export const updateTaskStatus = (task: Task, status: TaskStatus): Task => {
  return {
    ...task,
    status,
    updatedAt: new Date(),
    completedAt: status === 'done' ? new Date() : undefined,
  };
};

export const getTasksByGroup = (tasks: Task[], group: string): Task[] => {
  return tasks.filter((task) => task.group === group);
};

export const getSubtasks = (tasks: Task[], parentId: string): Task[] => {
  const subtasks = tasks.filter((task) => task.parentId === parentId);
  // Sort: non-completed tasks first, completed tasks at the end
  return subtasks.sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;
    // If both have the same status, sort by createdAt (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getRootTasks = (tasks: Task[]): Task[] => {
  const rootTasks = tasks.filter((task) => !task.parentId);
  // Sort by order if available, otherwise by createdAt
  return rootTasks.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const getTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter((task) => task.status === status);
};

export const getCompletedTasksToday = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tasks.filter(
    (task) =>
      task.status === 'done' &&
      task.completedAt &&
      task.completedAt >= today
  );
};

export const getCompletedTasksThisWeek = (tasks: Task[]): Task[] => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  return tasks.filter(
    (task) =>
      task.status === 'done' &&
      task.completedAt &&
      task.completedAt >= weekAgo
  );
};

