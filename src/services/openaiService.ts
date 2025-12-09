/**
 * OpenAI Service
 *
 * Handles communication with OpenAI API for task generation.
 * Converts natural language input into structured task objects.
 */

import {
  AI_MODEL,
  AI_MAX_TOKENS,
  AI_TEMPERATURE,
  loadSystemPrompt,
} from '../constants/aiConstants';
import { logger } from '../utils/logger';

/**
 * Parsed task structure returned by OpenAI API
 */
export interface ParsedTask {
  /** Task title */
  title: string;
  /** Task group/category */
  group: string;
  /** Optional priority level */
  priority?: 'low' | 'medium' | 'high';
  /** Optional task description */
  description?: string;
  /** Optional reference to parent task title (will be converted to actual task ID) */
  parentId?: string;
}

/**
 * OpenAI API response structure
 */
export interface OpenAIResponse {
  /** Array of parsed tasks */
  tasks: ParsedTask[];
}

/**
 * Generate tasks from user message using OpenAI API
 *
 * Sends a user message to OpenAI GPT-4o-mini and receives structured task suggestions.
 * Supports conversation history for context and existing groups for better categorization.
 *
 * @param message - User's natural language message describing tasks
 * @param existingGroups - List of existing task groups to help AI categorize tasks
 * @param conversationHistory - Previous messages in the conversation (max 10 messages)
 * @returns Array of parsed tasks ready to be added to the task list
 * @throws Error if API key is missing, API call fails, or response is invalid
 *
 * @example
 * ```ts
 * const tasks = await generateTasksFromMessage(
 *   'I need to buy groceries and finish the presentation',
 *   ['Work', 'Personal'],
 *   [{ role: 'user', content: 'Previous message' }]
 * );
 * ```
 */
export const generateTasksFromMessage = async (
  message: string,
  existingGroups: string[] = [],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ParsedTask[]> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.'
    );
  }

  try {
    // Load system prompt
    let systemPrompt = await loadSystemPrompt();

    // Enhance system prompt with existing groups if available
    if (existingGroups.length > 0) {
      const groupsList = existingGroups.join(', ');
      systemPrompt += `\n\n## Existing Groups\n\nYou have access to these existing groups: ${groupsList}\n\nPrefer using these groups when appropriate. Only create new groups if the task doesn't fit any existing category.`;
    }

    // Build messages array with conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: systemPrompt,
      },
      // Add conversation history (last 10 messages to avoid token limits)
      ...conversationHistory.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      // Add current user message
      {
        role: 'user',
        content: message,
      },
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: AI_TEMPERATURE,
        max_tokens: AI_MAX_TOKENS,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
      logger.error('OpenAI API error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from OpenAI API');
    }

    // Parse JSON response
    let parsedResponse: OpenAIResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      logger.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid JSON response from OpenAI API');
    }

    // Validate response structure
    if (!parsedResponse.tasks || !Array.isArray(parsedResponse.tasks)) {
      throw new Error('Invalid response format: missing tasks array');
    }

    // Validate and clean tasks
    const validTasks = parsedResponse.tasks
      .filter((task) => {
        if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
          return false;
        }
        if (!task.group || typeof task.group !== 'string' || task.group.trim().length === 0) {
          return false;
        }
        if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
          return false;
        }
        return true;
      })
      .map((task) => ({
        title: task.title.trim(),
        group: task.group.trim(),
        priority: task.priority,
        description: task.description?.trim() || undefined,
        parentId: task.parentId?.trim() || undefined, // Parent task title reference
      }));

    if (validTasks.length === 0) {
      throw new Error('No valid tasks found in AI response');
    }

    logger.log('Successfully generated tasks from OpenAI:', validTasks.length);
    return validTasks;
  } catch (error) {
    logger.error('Error generating tasks from OpenAI:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while generating tasks');
  }
};
