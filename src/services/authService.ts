/**
 * Authentication Service
 *
 * Handles all Firebase Authentication operations:
 * - Sign up
 * - Sign in
 * - Sign out
 * - Password reset
 * - User state management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export const signUp = async (data: SignUpData): Promise<UserCredential> => {
  const { email, password, displayName } = data;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName,
    });
  }

  return userCredential;
};

/**
 * Sign in an existing user
 */
export const signIn = async (data: SignInData): Promise<UserCredential> => {
  const { email, password } = data;
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get the current user ID
 */
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};
