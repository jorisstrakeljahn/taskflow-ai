/**
 * AI Constants
 * Configuration for OpenAI integration
 */

import { logger } from '../utils/logger';

export const AI_MODEL = 'gpt-4o-mini';

export const AI_MAX_TOKENS = 1000;

export const AI_TEMPERATURE = 0.7;

/**
 * Load system prompt from file
 * Loads from public/prompts/ai-prompt.txt at runtime
 */
export const loadSystemPrompt = async (): Promise<string> => {
  try {
    const response = await fetch('/prompts/ai-prompt.txt');
    if (response.ok) {
      const text = await response.text();
      if (text.trim().length > 0) {
        return text.trim();
      }
    }
    throw new Error('Failed to load system prompt file');
  } catch (error) {
    logger.error('Error loading system prompt:', error);
    throw new Error(
      'System prompt file not found. Please ensure public/prompts/ai-prompt.txt exists.'
    );
  }
};
