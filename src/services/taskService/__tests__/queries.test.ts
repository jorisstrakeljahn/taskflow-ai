/**
 * Unit Tests for taskService queries
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasks, subscribeToTasks } from '../queries';
import { Task } from '../../../types/task';
import { Timestamp } from 'firebase/firestore';
import * as firestoreModule from 'firebase/firestore';
import { db } from '../../firebase';

// Mock Firebase Firestore
vi.mock('../../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

describe('taskService/queries', () => {
  const mockUserId = 'user-123';
  const mockDate = new Date('2024-01-15T10:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch and return tasks for a user', async () => {
      const mockTasks = [
        {
          id: 'task-1',
          data: {
            title: 'Task 1',
            status: 'open',
            group: 'Work',
            userId: mockUserId,
            createdAt: Timestamp.fromDate(mockDate),
            updatedAt: Timestamp.fromDate(mockDate),
            order: 0,
          },
        },
        {
          id: 'task-2',
          data: {
            title: 'Task 2',
            status: 'in_progress',
            group: 'Personal',
            userId: mockUserId,
            createdAt: Timestamp.fromDate(mockDate),
            updatedAt: Timestamp.fromDate(mockDate),
            order: 1,
          },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockTasks.map((task) => ({
          id: task.id,
          data: () => task.data,
        })),
      };

      const mockCollection = {};
      const mockQuery = {};
      const mockWhere = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.where).mockReturnValue(mockWhere as never);
      vi.mocked(firestoreModule.query).mockReturnValue(mockQuery as never);
      vi.mocked(firestoreModule.getDocs).mockResolvedValue(mockQuerySnapshot as never);

      const result = await getTasks(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task-1');
      expect(result[1].id).toBe('task-2');
      expect(result[0].title).toBe('Task 1');
      expect(result[1].title).toBe('Task 2');
    });

    it('should return tasks sorted by order', async () => {
      const mockTasks = [
        {
          id: 'task-1',
          data: {
            title: 'Task 1',
            status: 'open',
            group: 'Work',
            userId: mockUserId,
            createdAt: Timestamp.fromDate(mockDate),
            updatedAt: Timestamp.fromDate(mockDate),
            order: 2,
          },
        },
        {
          id: 'task-2',
          data: {
            title: 'Task 2',
            status: 'open',
            group: 'Work',
            userId: mockUserId,
            createdAt: Timestamp.fromDate(mockDate),
            updatedAt: Timestamp.fromDate(mockDate),
            order: 0,
          },
        },
        {
          id: 'task-3',
          data: {
            title: 'Task 3',
            status: 'open',
            group: 'Work',
            userId: mockUserId,
            createdAt: Timestamp.fromDate(mockDate),
            updatedAt: Timestamp.fromDate(mockDate),
            order: 1,
          },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockTasks.map((task) => ({
          id: task.id,
          data: () => task.data,
        })),
      };

      vi.mocked(firestoreModule.collection).mockReturnValue({} as never);
      vi.mocked(firestoreModule.where).mockReturnValue({} as never);
      vi.mocked(firestoreModule.query).mockReturnValue({} as never);
      vi.mocked(firestoreModule.getDocs).mockResolvedValue(mockQuerySnapshot as never);

      const result = await getTasks(mockUserId);

      expect(result[0].id).toBe('task-2');
      expect(result[1].id).toBe('task-3');
      expect(result[2].id).toBe('task-1');
    });

    it('should handle empty result', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      vi.mocked(firestoreModule.collection).mockReturnValue({} as never);
      vi.mocked(firestoreModule.where).mockReturnValue({} as never);
      vi.mocked(firestoreModule.query).mockReturnValue({} as never);
      vi.mocked(firestoreModule.getDocs).mockResolvedValue(mockQuerySnapshot as never);

      const result = await getTasks(mockUserId);

      expect(result).toEqual([]);
    });

    it('should throw error on Firestore failure', async () => {
      const error = new Error('Firestore error');

      vi.mocked(firestoreModule.collection).mockReturnValue({} as never);
      vi.mocked(firestoreModule.where).mockReturnValue({} as never);
      vi.mocked(firestoreModule.query).mockReturnValue({} as never);
      vi.mocked(firestoreModule.getDocs).mockRejectedValue(error);

      await expect(getTasks(mockUserId)).rejects.toThrow('Firestore error');
    });
  });

  describe('subscribeToTasks', () => {
    it('should subscribe to task updates and call callback', () => {
      const callback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockTasks = [
        {
          id: 'task-1',
          data: {
            title: 'Task 1',
            status: 'open',
            group: 'Work',
            userId: mockUserId,
            createdAt: Timestamp.fromDate(mockDate),
            updatedAt: Timestamp.fromDate(mockDate),
            order: 0,
          },
        },
      ];

      const mockSnapshot = {
        docs: mockTasks.map((task) => ({
          id: task.id,
          data: () => task.data,
        })),
      };

      const mockCollection = {};
      const mockQuery = {};
      const mockWhere = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.where).mockReturnValue(mockWhere as never);
      vi.mocked(firestoreModule.query).mockReturnValue(mockQuery as never);
      vi.mocked(firestoreModule.onSnapshot).mockImplementation(
        (_query: unknown, onNextOrOptions: unknown, _onErrorOrOnNext?: unknown) => {
          // Handle both signatures: onSnapshot(query, onNext) and onSnapshot(query, options, onNext)
          let onNext: ((snapshot: unknown) => void) | undefined;
          if (typeof onNextOrOptions === 'function') {
            // First signature: onSnapshot(query, onNext)
            onNext = onNextOrOptions as (snapshot: unknown) => void;
          } else if (typeof _onErrorOrOnNext === 'function') {
            // Second signature: onSnapshot(query, options, onNext)
            onNext = _onErrorOrOnNext as (snapshot: unknown) => void;
          }

          if (onNext) {
            onNext(mockSnapshot);
          }
          return mockUnsubscribe;
        }
      );

      const unsubscribe = subscribeToTasks(mockUserId, callback);

      expect(unsubscribe).toBe(mockUnsubscribe);
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'task-1',
            title: 'Task 1',
          }),
        ])
      );
    });

    it('should handle errors in subscription', () => {
      const callback = vi.fn();
      const mockUnsubscribe = vi.fn();
      const error = new Error('Subscription error');

      vi.mocked(firestoreModule.collection).mockReturnValue({} as never);
      vi.mocked(firestoreModule.where).mockReturnValue({} as never);
      vi.mocked(firestoreModule.query).mockReturnValue({} as never);
      vi.mocked(firestoreModule.onSnapshot).mockImplementation(
        (_query: unknown, _onNextOrOptions: unknown, onError?: unknown) => {
          // The subscribeToTasks function passes error callback as third parameter
          if (typeof onError === 'function') {
            (onError as (error: Error) => void)(error);
          }
          return mockUnsubscribe;
        }
      );

      subscribeToTasks(mockUserId, callback);

      expect(callback).toHaveBeenCalledWith([]);
    });

    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const mockUnsubscribe = vi.fn();

      vi.mocked(firestoreModule.collection).mockReturnValue({} as never);
      vi.mocked(firestoreModule.where).mockReturnValue({} as never);
      vi.mocked(firestoreModule.query).mockReturnValue({} as never);
      vi.mocked(firestoreModule.onSnapshot).mockReturnValue(mockUnsubscribe);

      const unsubscribe = subscribeToTasks(mockUserId, callback);

      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
