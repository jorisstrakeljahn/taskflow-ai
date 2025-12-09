/**
 * Unit Tests for taskService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteTaskWithSubtasks,
  subscribeToTasks,
} from '../taskService';
import { Task } from '../../types/task';
import { Timestamp } from 'firebase/firestore';
import * as firestoreModule from 'firebase/firestore';
import { db } from '../firebase';

// Mock Firebase Firestore
vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    onSnapshot: vi.fn(),
    Timestamp: {
      now: vi.fn(() => Timestamp.fromDate(new Date())),
      fromDate: vi.fn((date: Date) => ({
        toDate: () => date,
        seconds: Math.floor(date.getTime() / 1000),
        nanoseconds: 0,
      })),
    },
  };
});

describe('taskService', () => {
  const mockUserId = 'user-123';
  const mockTaskId = 'task-123';
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

      const tasks = await getTasks(mockUserId);

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
      expect(firestoreModule.collection).toHaveBeenCalledWith(db, 'tasks');
    });

    it('should return empty array when no tasks exist', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      const mockCollection = {};
      const mockQuery = {};
      const mockWhere = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.where).mockReturnValue(mockWhere as never);
      vi.mocked(firestoreModule.query).mockReturnValue(mockQuery as never);
      vi.mocked(firestoreModule.getDocs).mockResolvedValue(mockQuerySnapshot as never);

      const tasks = await getTasks(mockUserId);

      expect(tasks).toHaveLength(0);
    });

    it('should sort tasks by order', async () => {
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

      const mockCollection = {};
      const mockQuery = {};
      const mockWhere = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.where).mockReturnValue(mockWhere as never);
      vi.mocked(firestoreModule.query).mockReturnValue(mockQuery as never);
      vi.mocked(firestoreModule.getDocs).mockResolvedValue(mockQuerySnapshot as never);

      const tasks = await getTasks(mockUserId);

      expect(tasks[0].order).toBe(0);
      expect(tasks[1].order).toBe(1);
      expect(tasks[2].order).toBe(2);
    });
  });

  describe('createTask', () => {
    it('should create a task and return its ID', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const mockDocRef = {
        id: mockTaskId,
      };

      const mockCollection = {};
      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.addDoc).mockResolvedValue(mockDocRef as never);

      const taskId = await createTask(newTask);

      expect(taskId).toBe(mockTaskId);
      expect(firestoreModule.addDoc).toHaveBeenCalled();
    });

    it('should include optional fields when provided', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        description: 'Task description',
        priority: 'high',
        parentId: 'parent-123',
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const mockDocRef = {
        id: mockTaskId,
      };

      const mockCollection = {};
      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.addDoc).mockResolvedValue(mockDocRef as never);

      await createTask(newTask);

      const addDocCall = vi.mocked(firestoreModule.addDoc).mock.calls[0];
      const taskData = addDocCall[1] as Record<string, unknown>;

      expect(taskData.description).toBe('Task description');
      expect(taskData.priority).toBe('high');
      expect(taskData.parentId).toBe('parent-123');
    });

    it('should handle errors when creating task', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const mockCollection = {};
      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.addDoc).mockRejectedValue(new Error('Firestore error'));

      await expect(createTask(newTask)).rejects.toThrow('Firestore error');
    });
  });

  describe('updateTask', () => {
    it('should update task with provided fields', async () => {
      const updates: Partial<Task> = {
        title: 'Updated Title',
        status: 'in_progress',
      };

      vi.mocked(firestoreModule.doc).mockReturnValue({} as never);
      vi.mocked(firestoreModule.updateDoc).mockResolvedValue(undefined);

      await updateTask(mockTaskId, updates);

      expect(firestoreModule.updateDoc).toHaveBeenCalled();
      const updateCall = vi.mocked(firestoreModule.updateDoc).mock.calls[0];
      const updateData = updateCall[1] as unknown as Record<string, unknown>;

      expect(updateData.title).toBe('Updated Title');
      expect(updateData.status).toBe('in_progress');
      expect(updateData.updatedAt).toBeDefined();
    });

    it('should handle completedAt date update', async () => {
      const completedDate = new Date();
      const updates: Partial<Task> = {
        completedAt: completedDate,
      };

      vi.mocked(firestoreModule.doc).mockReturnValue({} as never);
      vi.mocked(firestoreModule.updateDoc).mockResolvedValue(undefined);

      await updateTask(mockTaskId, updates);

      const updateCall = vi.mocked(firestoreModule.updateDoc).mock.calls[0];
      const updateData = updateCall[1] as unknown as Record<string, unknown>;

      expect(updateData.completedAt).toBeDefined();
    });

    it('should set description to null when empty string provided', async () => {
      const updates: Partial<Task> = {
        description: '',
      };

      vi.mocked(firestoreModule.doc).mockReturnValue({} as never);
      vi.mocked(firestoreModule.updateDoc).mockResolvedValue(undefined);

      await updateTask(mockTaskId, updates);

      const updateCall = vi.mocked(firestoreModule.updateDoc).mock.calls[0];
      const updateData = updateCall[1] as unknown as Record<string, unknown>;

      expect(updateData.description).toBe(null);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      vi.mocked(firestoreModule.doc).mockReturnValue({} as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTask(mockTaskId);

      expect(firestoreModule.deleteDoc).toHaveBeenCalled();
      expect(firestoreModule.doc).toHaveBeenCalledWith(db, 'tasks', mockTaskId);
    });
  });

  describe('deleteTaskWithSubtasks', () => {
    it('should delete task and all its subtasks', async () => {
      const allTasks: Task[] = [
        {
          id: mockTaskId,
          title: 'Parent Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: 'subtask-1',
          title: 'Subtask 1',
          status: 'open',
          group: 'Work',
          parentId: mockTaskId,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: 'subtask-2',
          title: 'Subtask 2',
          status: 'open',
          group: 'Work',
          parentId: mockTaskId,
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      vi.mocked(firestoreModule.doc).mockReturnValue({} as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTaskWithSubtasks(mockTaskId, allTasks);

      // Should be called 3 times: once for parent, twice for subtasks
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(3);
    });

    it('should only delete task if no subtasks exist', async () => {
      const allTasks: Task[] = [
        {
          id: mockTaskId,
          title: 'Parent Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      vi.mocked(firestoreModule.doc).mockReturnValue({} as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTaskWithSubtasks(mockTaskId, allTasks);

      // Should be called only once for the parent task
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToTasks', () => {
    it('should subscribe to task updates', () => {
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
        (_query, onNext, _onError, _options) => {
          if (typeof onNext === 'function') {
            onNext(mockSnapshot as never);
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
  });
});
