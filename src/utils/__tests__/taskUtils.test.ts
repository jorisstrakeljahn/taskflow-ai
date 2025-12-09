/**
 * Unit Tests for taskUtils
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createTask,
  updateTaskStatus,
  getTasksByGroup,
  getSubtasks,
  getRootTasks,
  getTasksByStatus,
  getCompletedTasksToday,
  getCompletedTasksThisWeek,
} from '../taskUtils';
import { Task, TaskStatus } from '../../types/task';

describe('taskUtils', () => {
  const mockUserId = 'user-123';
  const mockDate = new Date('2024-01-15T10:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createTask', () => {
    it('should create a task with required fields', () => {
      const task = createTask('Test Task', mockUserId);

      expect(task).toMatchObject({
        title: 'Test Task',
        status: 'open',
        group: 'General',
        userId: mockUserId,
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(task.parentId).toBeUndefined();
    });

    it('should create a task with custom group', () => {
      const task = createTask('Test Task', mockUserId, 'Work');

      expect(task.group).toBe('Work');
    });

    it('should create a subtask with parentId', () => {
      const parentId = 'parent-123';
      const task = createTask('Subtask', mockUserId, 'Work', parentId);

      expect(task.parentId).toBe(parentId);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const updated = updateTaskStatus(task, 'in_progress');

      expect(updated.status).toBe('in_progress');
      expect(updated.updatedAt).not.toBe(task.updatedAt);
      expect(updated.completedAt).toBeUndefined();
    });

    it('should set completedAt when status is done', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const updated = updateTaskStatus(task, 'done');

      expect(updated.status).toBe('done');
      expect(updated.completedAt).toBeInstanceOf(Date);
    });

    it('should clear completedAt when status changes from done', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'done',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
        completedAt: mockDate,
      };

      const updated = updateTaskStatus(task, 'open');

      expect(updated.status).toBe('open');
      expect(updated.completedAt).toBeUndefined();
    });
  });

  describe('getTasksByGroup', () => {
    it('should filter tasks by group', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          title: 'Task 2',
          status: 'open',
          group: 'Personal',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '3',
          title: 'Task 3',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const workTasks = getTasksByGroup(tasks, 'Work');

      expect(workTasks).toHaveLength(2);
      expect(workTasks.every((t) => t.group === 'Work')).toBe(true);
    });

    it('should return empty array if no tasks match group', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const result = getTasksByGroup(tasks, 'Personal');

      expect(result).toHaveLength(0);
    });
  });

  describe('getSubtasks', () => {
    it('should return all subtasks for a parent', () => {
      const parentId = 'parent-1';
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Parent',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          title: 'Subtask 1',
          status: 'open',
          group: 'Work',
          parentId,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '3',
          title: 'Subtask 2',
          status: 'open',
          group: 'Work',
          parentId,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '4',
          title: 'Other Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const subtasks = getSubtasks(tasks, parentId);

      expect(subtasks).toHaveLength(2);
      expect(subtasks.every((t) => t.parentId === parentId)).toBe(true);
    });

    it('should sort subtasks: non-completed first, then by createdAt', () => {
      const parentId = 'parent-1';
      const oldDate = new Date('2024-01-10T10:00:00Z');
      const newDate = new Date('2024-01-15T10:00:00Z');

      const tasks: Task[] = [
        {
          id: '1',
          title: 'Done Old',
          status: 'done',
          group: 'Work',
          parentId,
          userId: mockUserId,
          createdAt: oldDate,
          updatedAt: oldDate,
          completedAt: oldDate,
        },
        {
          id: '2',
          title: 'Open New',
          status: 'open',
          group: 'Work',
          parentId,
          userId: mockUserId,
          createdAt: newDate,
          updatedAt: newDate,
        },
        {
          id: '3',
          title: 'Open Old',
          status: 'open',
          group: 'Work',
          parentId,
          userId: mockUserId,
          createdAt: oldDate,
          updatedAt: oldDate,
        },
      ];

      const subtasks = getSubtasks(tasks, parentId);

      expect(subtasks[0].title).toBe('Open New');
      expect(subtasks[1].title).toBe('Open Old');
      expect(subtasks[2].title).toBe('Done Old');
    });
  });

  describe('getRootTasks', () => {
    it('should return only tasks without parentId', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Root 1',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          title: 'Subtask',
          status: 'open',
          group: 'Work',
          parentId: '1',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '3',
          title: 'Root 2',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const rootTasks = getRootTasks(tasks);

      expect(rootTasks).toHaveLength(2);
      expect(rootTasks.every((t) => !t.parentId)).toBe(true);
    });

    it('should sort by order if available', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          status: 'open',
          group: 'Work',
          order: 3,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          title: 'Task 2',
          status: 'open',
          group: 'Work',
          order: 1,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '3',
          title: 'Task 3',
          status: 'open',
          group: 'Work',
          order: 2,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const rootTasks = getRootTasks(tasks);

      expect(rootTasks[0].order).toBe(1);
      expect(rootTasks[1].order).toBe(2);
      expect(rootTasks[2].order).toBe(3);
    });
  });

  describe('getTasksByStatus', () => {
    it('should filter tasks by status', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Open',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          title: 'In Progress',
          status: 'in_progress',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '3',
          title: 'Done',
          status: 'done',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '4',
          title: 'Open 2',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const openTasks = getTasksByStatus(tasks, 'open');

      expect(openTasks).toHaveLength(2);
      expect(openTasks.every((t) => t.status === 'open')).toBe(true);
    });
  });

  describe('getCompletedTasksToday', () => {
    it('should return tasks completed today', () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tasks: Task[] = [
        {
          id: '1',
          title: 'Done Today',
          status: 'done',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          completedAt: today,
        },
        {
          id: '2',
          title: 'Done Yesterday',
          status: 'done',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          completedAt: yesterday,
        },
        {
          id: '3',
          title: 'Open',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      vi.setSystemTime(today);
      const completedToday = getCompletedTasksToday(tasks);

      expect(completedToday).toHaveLength(1);
      expect(completedToday[0].title).toBe('Done Today');
    });
  });

  describe('getCompletedTasksThisWeek', () => {
    it('should return tasks completed in the last 7 days', () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const eightDaysAgo = new Date(today);
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

      const tasks: Task[] = [
        {
          id: '1',
          title: 'Done Today',
          status: 'done',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          completedAt: today,
        },
        {
          id: '2',
          title: 'Done 3 Days Ago',
          status: 'done',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          completedAt: threeDaysAgo,
        },
        {
          id: '3',
          title: 'Done 8 Days Ago',
          status: 'done',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          completedAt: eightDaysAgo,
        },
      ];

      vi.setSystemTime(today);
      const completedThisWeek = getCompletedTasksThisWeek(tasks);

      expect(completedThisWeek).toHaveLength(2);
      expect(completedThisWeek.some((t) => t.title === 'Done Today')).toBe(true);
      expect(completedThisWeek.some((t) => t.title === 'Done 3 Days Ago')).toBe(true);
    });
  });
});
