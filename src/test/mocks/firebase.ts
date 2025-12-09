/**
 * Firebase Mocks for Testing
 */

import { vi } from 'vitest';
import { Timestamp } from 'firebase/firestore';

// Mock Firestore
export const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
};

// Mock Firebase Auth
export const mockAuth = {
  currentUser: null,
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
};

// Mock Firebase App
export const mockFirebaseApp = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
};

// Helper to create mock Firestore document
export const createMockDoc = (id: string, data: Record<string, unknown>) => {
  return {
    id,
    data: () => data,
    exists: () => true,
  };
};

// Helper to create mock QuerySnapshot
export const createMockQuerySnapshot = (
  docs: Array<{ id: string; data: Record<string, unknown> }>
) => {
  return {
    docs: docs.map((doc) => createMockDoc(doc.id, doc.data)),
    empty: docs.length === 0,
    size: docs.length,
    forEach: vi.fn((callback) => {
      docs.forEach((doc) => callback(createMockDoc(doc.id, doc.data)));
    }),
  };
};

// Helper to create mock Timestamp
export const createMockTimestamp = (date: Date = new Date()) => {
  return Timestamp.fromDate(date);
};
