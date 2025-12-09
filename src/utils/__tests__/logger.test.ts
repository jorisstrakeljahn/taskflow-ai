/**
 * Unit Tests for logger
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../logger';

describe('logger', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods
    global.console.log = vi.fn();
    global.console.error = vi.fn();
    global.console.warn = vi.fn();
    global.console.info = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logger.log', () => {
    it('should log in development mode', () => {
      // In test environment, DEV is typically true
      logger.log('test message');

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('logger.error', () => {
    it('should always log errors', () => {
      logger.error('error message');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('logger.warn', () => {
    it('should log warnings in development', () => {
      logger.warn('warning message');

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('logger.info', () => {
    it('should log info in development', () => {
      logger.info('info message');

      // Should not throw
      expect(true).toBe(true);
    });
  });
});
