/**
 * Unit Tests for taskService mutations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTask, updateTask, deleteTask, deleteTaskWithSubtasks } from '../mutations';
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
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
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

describe('taskService/mutations', () => {
  const mockUserId = 'user-123';
  const mockTaskId = 'task-123';
  const mockDate = new Date('2024-01-15T10:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and return its ID', async () => {
      const task: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
        order: 0,
      };

      const mockDocRef = { id: mockTaskId };
      const mockCollection = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.addDoc).mockResolvedValue(mockDocRef as never);

      const result = await createTask(task);

      expect(result).toBe(mockTaskId);
      expect(firestoreModule.addDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          title: 'New Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
        })
      );
    });

    it('should include optional fields when provided', async () => {
      const task: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        description: 'Test description',
        priority: 'high',
        parentId: 'parent-1',
        dueDate: mockDate,
        createdAt: mockDate,
        updatedAt: mockDate,
        order: 1,
      };

      const mockDocRef = { id: mockTaskId };
      const mockCollection = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.addDoc).mockResolvedValue(mockDocRef as never);

      await createTask(task);

      expect(firestoreModule.addDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          description: 'Test description',
          priority: 'high',
          parentId: 'parent-1',
        })
      );
    });

    it('should throw error on Firestore failure', async () => {
      const task: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'open',
        group: 'Work',
        userId: mockUserId,
        createdAt: mockDate,
        updatedAt: mockDate,
        order: 0,
      };

      const error = new Error('Firestore error');
      const mockCollection = {};

      vi.mocked(firestoreModule.collection).mockReturnValue(mockCollection as never);
      vi.mocked(firestoreModule.addDoc).mockRejectedValue(error);

      await expect(createTask(task)).rejects.toThrow('Firestore error');
    });
  });

  describe('updateTask', () => {
    it('should update a task with provided fields', async () => {
      const updates: Partial<Task> = {
        title: 'Updated Title',
        status: 'in_progress',
      };

      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.updateDoc).mockResolvedValue(undefined);

      await updateTask(mockTaskId, updates);

      expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          title: 'Updated Title',
          status: 'in_progress',
          updatedAt: expect.any(Object),
        })
      );
    });

    it('should handle date fields correctly', async () => {
      const updates: Partial<Task> = {
        completedAt: mockDate,
        dueDate: mockDate,
      };

      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.updateDoc).mockResolvedValue(undefined);

      await updateTask(mockTaskId, updates);

      const updateCall = vi.mocked(firestoreModule.updateDoc).mock.calls[0];
      const updateData = updateCall[1] as unknown as Record<string, unknown>;

      expect(updateData.completedAt).toBeInstanceOf(Object);
      expect(updateData.dueDate).toBeInstanceOf(Object);
    });

    it('should set null for empty optional fields', async () => {
      const updates: Partial<Task> = {
        description: '',
        priority: undefined,
      };

      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.updateDoc).mockResolvedValue(undefined);

      await updateTask(mockTaskId, updates);

      const updateCall = vi.mocked(firestoreModule.updateDoc).mock.calls[0];
      const updateData = updateCall[1] as unknown as Record<string, unknown>;

      expect(updateData.description).toBe(null);
      // priority is undefined, so it's not included in updateData
      expect(updateData.priority).toBeUndefined();
    });

    it('should throw error on Firestore failure', async () => {
      const updates: Partial<Task> = {
        title: 'Updated Title',
      };

      const error = new Error('Firestore error');
      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.updateDoc).mockRejectedValue(error);

      await expect(updateTask(mockTaskId, updates)).rejects.toThrow('Firestore error');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTask(mockTaskId);

      expect(firestoreModule.deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should throw error on Firestore failure', async () => {
      const error = new Error('Firestore error');
      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.deleteDoc).mockRejectedValue(error);

      await expect(deleteTask(mockTaskId)).rejects.toThrow('Firestore error');
    });
  });

  describe('deleteTaskWithSubtasks', () => {
    it('should delete a task and all its subtasks', async () => {
      const allTasks: Task[] = [
        {
          id: mockTaskId,
          title: 'Parent Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
        {
          id: 'subtask-1',
          title: 'Subtask 1',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          parentId: mockTaskId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
        {
          id: 'subtask-2',
          title: 'Subtask 2',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          parentId: mockTaskId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 1,
        },
        {
          id: 'other-task',
          title: 'Other Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
      ];

      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTaskWithSubtasks(mockTaskId, allTasks);

      // Should delete parent + 2 subtasks = 3 calls
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(3);
    });

    it('should handle nested subtasks', async () => {
      const allTasks: Task[] = [
        {
          id: mockTaskId,
          title: 'Parent Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
        {
          id: 'subtask-1',
          title: 'Subtask 1',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          parentId: mockTaskId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
        {
          id: 'subtask-2',
          title: 'Subtask 2',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          parentId: 'subtask-1',
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
      ];

      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTaskWithSubtasks(mockTaskId, allTasks);

      // Should delete all 3 tasks (parent + 2 subtasks)
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(3);
    });

    it('should handle task with no subtasks', async () => {
      const allTasks: Task[] = [
        {
          id: mockTaskId,
          title: 'Parent Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
      ];

      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.deleteDoc).mockResolvedValue(undefined);

      await deleteTaskWithSubtasks(mockTaskId, allTasks);

      // Should only delete the parent task
      expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(1);
    });

    it('should throw error if deletion fails', async () => {
      const allTasks: Task[] = [
        {
          id: mockTaskId,
          title: 'Parent Task',
          status: 'open',
          group: 'Work',
          userId: mockUserId,
          createdAt: mockDate,
          updatedAt: mockDate,
          order: 0,
        },
      ];

      const error = new Error('Firestore error');
      const mockDocRef = {};

      vi.mocked(firestoreModule.doc).mockReturnValue(mockDocRef as never);
      vi.mocked(firestoreModule.deleteDoc).mockRejectedValue(error);

      await expect(deleteTaskWithSubtasks(mockTaskId, allTasks)).rejects.toThrow('Firestore error');
    });
  });
});
