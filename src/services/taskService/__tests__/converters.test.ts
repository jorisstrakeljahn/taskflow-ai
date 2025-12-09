/**
 * Unit Tests for taskService converters
 */

import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import { Task } from '../../../types/task';
import { timestampToDate, taskToFirestore, firestoreToTask, sortTasksByOrder } from '../converters';

describe('taskService/converters', () => {
  const mockDate = new Date('2024-01-15T10:00:00Z');
  const mockTimestamp = Timestamp.fromDate(mockDate);

  describe('timestampToDate', () => {
    it('should convert Firestore Timestamp to Date', () => {
      const result = timestampToDate(mockTimestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(mockDate.getTime());
    });

    it('should return Date object as-is', () => {
      const result = timestampToDate(mockDate);
      expect(result).toBe(mockDate);
    });

    it('should return undefined for undefined input', () => {
      expect(timestampToDate(undefined)).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      expect(timestampToDate(null as unknown as undefined)).toBeUndefined();
    });
  });

  describe('taskToFirestore', () => {
    it('should convert Task to Firestore format with all required fields', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        createdAt: mockDate,
        updatedAt: mockDate,
        order: 0,
      };

      const result = taskToFirestore(task);

      expect(result.title).toBe('Test Task');
      expect(result.status).toBe('open');
      expect(result.group).toBe('Work');
      expect(result.userId).toBe('user-1');
      expect(result.order).toBe(0);
      expect(result.createdAt).toBeInstanceOf(Timestamp);
      expect(result.updatedAt).toBeInstanceOf(Timestamp);
    });

    it('should include optional fields when provided', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        description: 'Test description',
        priority: 'high',
        parentId: 'parent-1',
        completedAt: mockDate,
        dueDate: mockDate,
        createdAt: mockDate,
        updatedAt: mockDate,
        order: 1,
      };

      const result = taskToFirestore(task);

      expect(result.description).toBe('Test description');
      expect(result.priority).toBe('high');
      expect(result.parentId).toBe('parent-1');
      expect(result.completedAt).toBeInstanceOf(Timestamp);
      expect(result.dueDate).toBeInstanceOf(Timestamp);
    });

    it('should exclude optional fields when null or empty', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        description: '',
        priority: undefined,
        parentId: null as unknown as undefined,
        createdAt: mockDate,
        updatedAt: mockDate,
        order: 0,
      };

      const result = taskToFirestore(task);

      expect(result.description).toBeUndefined();
      expect(result.priority).toBeUndefined();
      expect(result.parentId).toBeUndefined();
    });

    it('should use Timestamp.now() for createdAt if not provided', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        createdAt: undefined as unknown as Date,
        updatedAt: mockDate,
        order: 0,
      };

      const result = taskToFirestore(task);
      expect(result.createdAt).toBeInstanceOf(Timestamp);
    });

    it('should default order to 0 if undefined', () => {
      const task: Task = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        createdAt: mockDate,
        updatedAt: mockDate,
        order: undefined as unknown as number,
      };

      const result = taskToFirestore(task);
      expect(result.order).toBe(0);
    });
  });

  describe('firestoreToTask', () => {
    it('should convert Firestore document to Task', () => {
      const docData = {
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
        order: 0,
      };

      const result = firestoreToTask(docData, 'task-1');

      expect(result.id).toBe('task-1');
      expect(result.title).toBe('Test Task');
      expect(result.status).toBe('open');
      expect(result.group).toBe('Work');
      expect(result.userId).toBe('user-1');
      expect(result.order).toBe(0);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle optional fields', () => {
      const docData = {
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        description: 'Test description',
        priority: 'high',
        parentId: 'parent-1',
        completedAt: mockTimestamp,
        dueDate: mockTimestamp,
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
        order: 1,
      };

      const result = firestoreToTask(docData, 'task-1');

      expect(result.description).toBe('Test description');
      expect(result.priority).toBe('high');
      expect(result.parentId).toBe('parent-1');
      expect(result.completedAt).toBeInstanceOf(Date);
      expect(result.dueDate).toBeInstanceOf(Date);
    });

    it('should use default values for missing fields', () => {
      const docData = {
        title: 'Test Task',
        userId: 'user-1',
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      const result = firestoreToTask(docData, 'task-1');

      expect(result.status).toBe('open');
      expect(result.group).toBe('General');
      expect(result.order).toBe(0);
      expect(result.description).toBeUndefined();
      expect(result.priority).toBeUndefined();
    });

    it('should handle missing timestamps', () => {
      const docData = {
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
      };

      const result = firestoreToTask(docData, 'task-1');

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('sortTasksByOrder', () => {
    it('should sort tasks by order ascending', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          title: 'Task 1',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          order: 2,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: 'task-2',
          title: 'Task 2',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          order: 0,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: 'task-3',
          title: 'Task 3',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          order: 1,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const result = sortTasksByOrder(tasks);

      expect(result[0].id).toBe('task-2');
      expect(result[1].id).toBe('task-3');
      expect(result[2].id).toBe('task-1');
    });

    it('should handle undefined order values', () => {
      const tasks: Task[] = [
        {
          id: 'task-1',
          title: 'Task 1',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          order: 1,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: 'task-2',
          title: 'Task 2',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          order: undefined as unknown as number,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: 'task-3',
          title: 'Task 3',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          order: 0,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      // Create a copy to avoid mutating the original array
      const tasksCopy = [...tasks];
      const result = sortTasksByOrder(tasksCopy);

      // task-3 (order: 0) and task-2 (order: undefined = 0) should come first, then task-1 (order: 1)
      // When order is the same, the original order is preserved
      expect(result[0].id).toBe('task-2'); // undefined order = 0, comes first in original array
      expect(result[1].id).toBe('task-3'); // order: 0, comes after task-2 in original array
      expect(result[2].id).toBe('task-1'); // order: 1
    });

    it('should handle empty array', () => {
      const result = sortTasksByOrder([]);
      expect(result).toEqual([]);
    });
  });
});
