/**
 * Chat-related types
 */

import { ParsedTask } from '../services/openaiService';

export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: number;
  tasks?: ParsedTask[]; // Tasks associated with this message (for assistant messages)
}

export interface ChatConversation {
  messages: ChatMessage[];
}
