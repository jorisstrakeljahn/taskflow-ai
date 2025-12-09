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
 *
 * Creates a new user account with email and password, and optionally sets a display name.
 *
 * @param data - Sign up data including email, password, and optional display name
 * @returns User credential object
 * @throws Error if sign up fails (e.g., email already exists, weak password)
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
 *
 * @param data - Sign in data including email and password
 * @returns User credential object
 * @throws Error if sign in fails (e.g., wrong password, user not found)
 */
export const signIn = async (data: SignInData): Promise<UserCredential> => {
  const { email, password } = data;
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 *
 * @throws Error if sign out fails
 */
export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

/**
 * Send password reset email
 *
 * Sends a password reset email to the specified email address.
 *
 * @param email - Email address to send reset link to
 * @throws Error if email is not found or sending fails
 */
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Get the current authenticated user
 *
 * @returns Current user object or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get the current authenticated user ID
 *
 * @returns User ID string or null if not authenticated
 */
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};
