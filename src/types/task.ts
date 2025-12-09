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
  dueDate?: Date; // Optional deadline/due date
  userId: string;
  order?: number; // Order for drag & drop sorting
}

export interface TaskGroup {
  name: string;
  count: number;
}
