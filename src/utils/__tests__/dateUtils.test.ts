/**
 * Unit Tests for dateUtils
 */

import { describe, it, expect } from 'vitest';
import { parseTaskDates, parseTaskDatesArray } from '../dateUtils';
import { Task } from '../../types/task';

describe('dateUtils', () => {
  describe('parseTaskDates', () => {
    it('should convert date strings to Date objects', () => {
      const taskData = {
        id: 'task-1',
        title: 'Test Task',
        status: 'open',
        group: 'Work',
        userId: 'user-1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      const task = parseTaskDates(taskData);

      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(task.completedAt).toBeUndefined();
    });

    it('should handle completedAt date', () => {
      const taskData = {
        id: 'task-1',
        title: 'Test Task',
        status: 'done',
        group: 'Work',
        userId: 'user-1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-01-15T12:00:00Z',
      };

      const task = parseTaskDates(taskData);

      expect(task.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('parseTaskDatesArray', () => {
    it('should convert array of tasks with date strings', () => {
      const tasksData = [
        {
          id: 'task-1',
          title: 'Task 1',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'task-2',
          title: 'Task 2',
          status: 'open',
          group: 'Work',
          userId: 'user-1',
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
        },
      ];

      const tasks = parseTaskDatesArray(tasksData);

      expect(tasks).toHaveLength(2);
      expect(tasks[0].createdAt).toBeInstanceOf(Date);
      expect(tasks[1].createdAt).toBeInstanceOf(Date);
    });
  });
});
