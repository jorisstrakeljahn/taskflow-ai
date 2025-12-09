/**
 * Unit Tests for authService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signUp,
  signIn,
  signOutUser,
  resetPassword,
  getCurrentUser,
  getCurrentUserId,
} from '../authService';
import * as firebaseAuth from 'firebase/auth';
import { auth } from '../firebase';

// Mock Firebase Auth
vi.mock('../firebase', () => ({
  auth: {},
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
}));

describe('authService', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockDisplayName = 'Test User';
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const mockUser = {
        uid: mockUserId,
        email: mockEmail,
        displayName: null,
      };

      const mockUserCredential = {
        user: mockUser,
      };

      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValue(
        mockUserCredential as never
      );
      vi.mocked(firebaseAuth.updateProfile).mockResolvedValue(undefined);

      const result = await signUp({
        email: mockEmail,
        password: mockPassword,
      });

      expect(result).toEqual(mockUserCredential);
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        mockEmail,
        mockPassword
      );
    });

    it('should update display name when provided', async () => {
      const mockUser = {
        uid: mockUserId,
        email: mockEmail,
        displayName: null,
      };

      const mockUserCredential = {
        user: mockUser,
      };

      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValue(
        mockUserCredential as never
      );
      vi.mocked(firebaseAuth.updateProfile).mockResolvedValue(undefined);

      await signUp({
        email: mockEmail,
        password: mockPassword,
        displayName: mockDisplayName,
      });

      expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: mockDisplayName,
      });
    });

    it('should not update profile when display name is not provided', async () => {
      const mockUser = {
        uid: mockUserId,
        email: mockEmail,
        displayName: null,
      };

      const mockUserCredential = {
        user: mockUser,
      };

      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValue(
        mockUserCredential as never
      );

      await signUp({
        email: mockEmail,
        password: mockPassword,
      });

      expect(firebaseAuth.updateProfile).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in an existing user', async () => {
      const mockUser = {
        uid: mockUserId,
        email: mockEmail,
      };

      const mockUserCredential = {
        user: mockUser,
      };

      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue(
        mockUserCredential as never
      );

      const result = await signIn({
        email: mockEmail,
        password: mockPassword,
      });

      expect(result).toEqual(mockUserCredential);
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        mockEmail,
        mockPassword
      );
    });
  });

  describe('signOutUser', () => {
    it('should sign out the current user', async () => {
      vi.mocked(firebaseAuth.signOut).mockResolvedValue(undefined);

      await signOutUser();

      expect(firebaseAuth.signOut).toHaveBeenCalledWith(auth);
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      vi.mocked(firebaseAuth.sendPasswordResetEmail).mockResolvedValue(undefined);

      await resetPassword(mockEmail);

      expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith(auth, mockEmail);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when logged in', () => {
      const mockUser = {
        uid: mockUserId,
        email: mockEmail,
      };

      // Mock auth.currentUser
      Object.defineProperty(auth, 'currentUser', {
        value: mockUser,
        writable: true,
      });

      const user = getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null when no user is logged in', () => {
      Object.defineProperty(auth, 'currentUser', {
        value: null,
        writable: true,
      });

      const user = getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('getCurrentUserId', () => {
    it('should return user ID when logged in', () => {
      const mockUser = {
        uid: mockUserId,
        email: mockEmail,
      };

      Object.defineProperty(auth, 'currentUser', {
        value: mockUser,
        writable: true,
      });

      const userId = getCurrentUserId();

      expect(userId).toBe(mockUserId);
    });

    it('should return null when no user is logged in', () => {
      Object.defineProperty(auth, 'currentUser', {
        value: null,
        writable: true,
      });

      const userId = getCurrentUserId();

      expect(userId).toBeNull();
    });
  });
});
