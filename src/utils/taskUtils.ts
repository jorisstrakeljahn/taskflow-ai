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
  return tasks.filter((task) => task.parentId === parentId);
};

export const getRootTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.parentId);
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

