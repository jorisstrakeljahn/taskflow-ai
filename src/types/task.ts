export type TaskStatus = 'open' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  group: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  userId: string;
}

export interface TaskGroup {
  name: string;
  count: number;
}

