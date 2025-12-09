/**
 * Input Validation Utilities
 *
 * Provides functions for validating and sanitizing user input
 * to prevent XSS attacks and ensure data integrity.
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 * and limiting length. React automatically escapes HTML, but this provides
 * an additional layer of protection.
 *
 * @param input - Input string to sanitize
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns Sanitized string
 */
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and control characters (except newlines and tabs)
  // eslint-disable-next-line no-control-regex
  let sanitized = input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
};

/**
 * Validate task title
 *
 * @param title - Task title to validate
 * @returns Object with isValid flag and error message
 */
export const validateTaskTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Title is required' };
  }

  const sanitized = sanitizeString(title, 200);
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Title cannot be empty' };
  }

  if (sanitized.length < 1) {
    return { isValid: false, error: 'Title must be at least 1 character' };
  }

  if (sanitized.length > 200) {
    return { isValid: false, error: 'Title must be less than 200 characters' };
  }

  return { isValid: true };
};

/**
 * Validate task description
 *
 * @param description - Task description to validate
 * @returns Object with isValid flag and error message
 */
export const validateTaskDescription = (
  description: string
): { isValid: boolean; error?: string } => {
  if (!description) {
    return { isValid: true }; // Description is optional
  }

  if (typeof description !== 'string') {
    return { isValid: false, error: 'Description must be a string' };
  }

  const sanitized = sanitizeString(description, 2000);
  if (sanitized.length > 2000) {
    return { isValid: false, error: 'Description must be less than 2000 characters' };
  }

  return { isValid: true };
};

/**
 * Validate task group name
 *
 * @param group - Group name to validate
 * @returns Object with isValid flag and error message
 */
export const validateTaskGroup = (group: string): { isValid: boolean; error?: string } => {
  if (!group || typeof group !== 'string') {
    return { isValid: false, error: 'Group is required' };
  }

  const sanitized = sanitizeString(group, 50);
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Group cannot be empty' };
  }

  if (sanitized.length > 50) {
    return { isValid: false, error: 'Group name must be less than 50 characters' };
  }

  return { isValid: true };
};

/**
 * Validate chat message
 *
 * @param message - Chat message to validate
 * @returns Object with isValid flag and error message
 */
export const validateChatMessage = (message: string): { isValid: boolean; error?: string } => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }

  const sanitized = sanitizeString(message, 5000);
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (sanitized.length > 5000) {
    return { isValid: false, error: 'Message must be less than 5000 characters' };
  }

  return { isValid: true };
};

/**
 * Validate email address
 *
 * @param email - Email address to validate
 * @returns Object with isValid flag and error message
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  return { isValid: true };
};

/**
 * Validate password
 *
 * @param password - Password to validate
 * @returns Object with isValid flag and error message
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password must be less than 128 characters' };
  }

  return { isValid: true };
};
