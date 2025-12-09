/**
 * Custom hook for managing chat state and operations
 *
 * Manages the chat interface state including messages, task suggestions,
 * editing, and error handling. Provides handlers for sending messages,
 * adding tasks, and managing the conversation flow.
 *
 * @param onSendMessage - Function to send messages to OpenAI API and generate tasks
 * @param onAddTasks - Function to add parsed tasks to the task list
 * @returns Chat state and handlers including messages, current input, processing state, and action handlers
 *
 * @example
 * ```tsx
 * const { messages, handleSendMessage, handleAddTasks } = useChatState({
 *   onSendMessage: generateTasksFromMessage,
 *   onAddTasks: addTasksToFirebase
 * });
 * ```
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../../../../types/chat';
import { ParsedTask } from '../../../../services/openaiService';
import { logger } from '../../../../utils/logger';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateChatMessage } from '../../../../utils/inputValidation';
import { useRateLimit } from '../../../../hooks/useRateLimit';

interface EditableTask extends ParsedTask {
  id: string;
}

interface UseChatStateProps {
  onSendMessage: (
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ) => Promise<ParsedTask[]>;
  onAddTasks: (tasks: ParsedTask[]) => Promise<void>;
}

export const useChatState = ({ onSendMessage, onAddTasks }: UseChatStateProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<EditableTask | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rate limiting: max 20 requests per minute
  const checkRateLimit = useRateLimit({
    maxRequests: 20,
    windowMs: 60000, // 1 minute
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const generateMessageId = useCallback(
    () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isProcessing) return;

    // Validate input
    const validation = validateChatMessage(currentMessage.trim());
    if (!validation.isValid) {
      setError(validation.error || t('chat.error'));
      return;
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit();
    if (!rateLimitResult.allowed) {
      const retrySeconds = Math.ceil((rateLimitResult.retryAfter || 0) / 1000);
      setError(
        t('chat.rateLimitError', { seconds: retrySeconds }) ||
          `Too many requests. Please wait ${retrySeconds} seconds.`
      );
      return;
    }

    const userMessageText = currentMessage.trim();
    setCurrentMessage('');
    setIsProcessing(true);
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: userMessageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg) => ({
          role: msg.role,
          content:
            msg.role === 'assistant' && msg.tasks
              ? `${msg.content}\n\nTasks: ${JSON.stringify(msg.tasks)}`
              : msg.content,
        }));

      // Generate tasks from message
      const tasks = await onSendMessage(userMessageText, conversationHistory);

      // Add assistant message with tasks
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content:
          tasks.length > 0
            ? t('chat.suggestions')
            : "I couldn't generate any tasks from your message. Could you provide more details?",
        tasks: tasks.length > 0 ? tasks : undefined,
        timestamp: Date.now(),
      };

      // Only add message if it has content or tasks
      if (
        assistantMessage.content ||
        (assistantMessage.tasks && assistantMessage.tasks.length > 0)
      ) {
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      logger.error('Error generating tasks:', err);
      const errorMessage = err instanceof Error ? err.message : t('chat.error');
      setError(errorMessage);

      // Add error message
      const errorMessageObj: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsProcessing(false);
    }
  }, [currentMessage, isProcessing, messages, onSendMessage, generateMessageId, t, checkRateLimit]);

  const handleRegenerate = useCallback(async () => {
    if (messages.length === 0 || isProcessing) return;

    // Find last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user');
    if (!lastUserMessage) return;

    // Remove last assistant response
    setMessages((prev) => {
      const lastIndex = prev.length - 1;
      if (lastIndex >= 0 && prev[lastIndex].role === 'assistant') {
        return prev.slice(0, lastIndex);
      }
      return prev;
    });

    // Resend with last user message
    setCurrentMessage(lastUserMessage.content);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [messages, isProcessing, handleSendMessage]);

  const handleTaskAction = useCallback(
    async (task: EditableTask, action: 'add' | 'edit' | 'remove') => {
      if (action === 'add') {
        try {
          // If this is a subtask, we need to include its parent in the batch
          const tasksToAdd: ParsedTask[] = [task];
          const taskTitlesToRemove = new Set<string>([task.title]);

          // If task has parentId, find parent task in the same message
          if (task.parentId) {
            const parentMessage = messages.find((msg) =>
              msg.tasks?.some((t) => t.title === task.parentId)
            );
            if (parentMessage) {
              const parentTask = parentMessage.tasks?.find((t) => t.title === task.parentId);
              if (parentTask && !tasksToAdd.some((t) => t.title === parentTask.title)) {
                tasksToAdd.unshift(parentTask); // Add parent first
                taskTitlesToRemove.add(parentTask.title);
              }
            }
          }

          // Also collect all subtasks of this task if it's a parent
          messages.forEach((msg) => {
            if (msg.tasks) {
              msg.tasks.forEach((t) => {
                if (t.parentId === task.title) {
                  tasksToAdd.push(t);
                  taskTitlesToRemove.add(t.title);
                }
              });
            }
          });

          await onAddTasks(tasksToAdd);

          // Remove tasks from messages after successful addition
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.tasks && msg.tasks.some((t) => taskTitlesToRemove.has(t.title))) {
                const filteredTasks = msg.tasks.filter((t) => !taskTitlesToRemove.has(t.title));
                return {
                  ...msg,
                  tasks: filteredTasks.length > 0 ? filteredTasks : undefined,
                };
              }
              return msg;
            })
          );
        } catch (err) {
          logger.error('Error adding task:', err);
        }
      } else if (action === 'edit') {
        setEditingTaskId(task.id);
        setEditedTask(task);
      } else if (action === 'remove') {
        // Remove task from message (and its subtasks if it's a parent)
        const taskTitlesToRemove = new Set<string>([task.title]);

        // Find all subtasks of this task
        messages.forEach((msg) => {
          if (msg.tasks) {
            msg.tasks.forEach((t) => {
              if (t.parentId === task.title) {
                taskTitlesToRemove.add(t.title);
              }
            });
          }
        });

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.tasks && msg.tasks.some((t) => taskTitlesToRemove.has(t.title))) {
              const updatedTasks = msg.tasks.filter((t) => !taskTitlesToRemove.has(t.title));
              return {
                ...msg,
                tasks: updatedTasks.length > 0 ? updatedTasks : undefined,
              };
            }
            return msg;
          })
        );
      }
    },
    [messages, onAddTasks]
  );

  const handleEditTask = useCallback((taskId: string, task: ParsedTask) => {
    setEditingTaskId(taskId);
    setEditedTask({ ...task, id: taskId });
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editedTask && editingTaskId) {
      // Update task in messages
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.tasks) {
            const taskIndex = msg.tasks.findIndex(
              (_task, idx) => `${msg.id}-task-${idx}` === editingTaskId
            );
            if (taskIndex !== -1) {
              const updatedTasks = [...msg.tasks];
              updatedTasks[taskIndex] = editedTask;
              return { ...msg, tasks: updatedTasks };
            }
          }
          return msg;
        })
      );
      setEditingTaskId(null);
      setEditedTask(null);
    }
  }, [editedTask, editingTaskId]);

  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditedTask(null);
  }, []);

  const handleUpdateEditedTask = useCallback((updates: Partial<ParsedTask>) => {
    setEditedTask((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const handleResetChat = useCallback(() => {
    setMessages([]);
    setCurrentMessage('');
    setError(null);
    setEditingTaskId(null);
    setEditedTask(null);
  }, []);

  const lastMessageWithTasks = messages.filter((msg) => msg.tasks && msg.tasks.length > 0).pop();
  const showRegenerate = !!lastMessageWithTasks && !isProcessing;

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    isProcessing,
    error,
    setError,
    editingTaskId,
    editedTask,
    messagesEndRef,
    handleSendMessage,
    handleRegenerate,
    handleTaskAction,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleUpdateEditedTask,
    handleResetChat,
    showRegenerate,
  };
};
