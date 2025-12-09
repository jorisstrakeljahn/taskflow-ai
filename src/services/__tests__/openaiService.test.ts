/**
 * Unit Tests for openaiService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTasksFromMessage, ParsedTask } from '../openaiService';
import * as aiConstants from '../../constants/aiConstants';

// Mock fetch
global.fetch = vi.fn();

// Mock logger
vi.mock('../../utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock aiConstants
vi.mock('../../constants/aiConstants', () => ({
  AI_MODEL: 'gpt-4o-mini',
  AI_MAX_TOKENS: 2000,
  AI_TEMPERATURE: 0.7,
  loadSystemPrompt: vi.fn(),
}));

describe('openaiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key');
    vi.mocked(aiConstants.loadSystemPrompt).mockResolvedValue('Test system prompt');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('generateTasksFromMessage', () => {
    it('should generate tasks from user message', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: 'Buy groceries',
                    group: 'Personal',
                    priority: 'high',
                  },
                  {
                    title: 'Finish presentation',
                    group: 'Work',
                    priority: 'medium',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const tasks = await generateTasksFromMessage(
        'I need to buy groceries and finish my presentation'
      );

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Buy groceries');
      expect(tasks[0].group).toBe('Personal');
      expect(tasks[1].title).toBe('Finish presentation');
      expect(global.fetch).toHaveBeenCalled();
      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      expect(fetchCall[0]).toBe('https://api.openai.com/v1/chat/completions');
      const headers = (fetchCall[1] as RequestInit)?.headers as Record<string, string>;
      expect(headers?.Authorization).toBe('Bearer test-api-key');
    });

    it('should throw error when API key is missing', async () => {
      // Remove API key by stubbing with empty string
      vi.stubEnv('VITE_OPENAI_API_KEY', '');

      await expect(generateTasksFromMessage('Test message')).rejects.toThrow(
        'OpenAI API key is not configured'
      );

      // Restore API key for other tests
      vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key');
    });

    it('should include existing groups in system prompt', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: 'New task',
                    group: 'Work',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await generateTasksFromMessage('Test message', ['Work', 'Personal']);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]?.body as string);

      expect(body.messages[0].content).toContain('Work, Personal');
    });

    it('should include conversation history', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: 'New task',
                    group: 'Work',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const conversationHistory = [
        { role: 'user' as const, content: 'Previous message' },
        { role: 'assistant' as const, content: 'Previous response' },
      ];

      await generateTasksFromMessage('Current message', [], conversationHistory);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]?.body as string);

      expect(body.messages).toHaveLength(4); // system + 2 history + current
      expect(body.messages[1].content).toBe('Previous message');
      expect(body.messages[2].content).toBe('Previous response');
    });

    it('should limit conversation history to last 10 messages', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: 'New task',
                    group: 'Work',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const longHistory = Array.from({ length: 15 }, (_, i) => ({
        role: 'user' as const,
        content: `Message ${i}`,
      }));

      await generateTasksFromMessage('Current message', [], longHistory);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]?.body as string);

      // Should only include last 10 history messages + system + current = 12 total
      expect(body.messages.length).toBeLessThanOrEqual(12);
    });

    it('should handle API errors', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          error: {
            message: 'Invalid API key',
          },
        }),
      } as Response);

      await expect(generateTasksFromMessage('Test message')).rejects.toThrow('Invalid API key');
    });

    it('should handle invalid JSON response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Invalid JSON',
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(generateTasksFromMessage('Test message')).rejects.toThrow(
        'Invalid JSON response'
      );
    });

    it('should validate and filter invalid tasks', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: 'Valid Task',
                    group: 'Work',
                    priority: 'high',
                  },
                  {
                    title: '', // Invalid: empty title
                    group: 'Work',
                  },
                  {
                    title: 'Another Valid Task',
                    group: 'Personal',
                    priority: 'invalid', // Invalid: invalid priority
                  },
                  {
                    title: 'Third Task',
                    group: '', // Invalid: empty group
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const tasks = await generateTasksFromMessage('Test message');

      // Should only return valid tasks
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Valid Task');
    });

    it('should trim task titles and groups', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: '  Trimmed Title  ',
                    group: '  Trimmed Group  ',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const tasks = await generateTasksFromMessage('Test message');

      expect(tasks[0].title).toBe('Trimmed Title');
      expect(tasks[0].group).toBe('Trimmed Group');
    });

    it('should handle tasks with parentId', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: 'Parent Task',
                    group: 'Work',
                  },
                  {
                    title: 'Subtask',
                    group: 'Work',
                    parentId: 'Parent Task',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const tasks = await generateTasksFromMessage('Test message');

      expect(tasks).toHaveLength(2);
      expect(tasks[1].parentId).toBe('Parent Task');
    });

    it('should throw error when no valid tasks found', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tasks: [
                  {
                    title: '', // All tasks invalid
                    group: '',
                  },
                ],
              }),
            },
          },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(generateTasksFromMessage('Test message')).rejects.toThrow(
        'No valid tasks found'
      );
    });
  });
});
