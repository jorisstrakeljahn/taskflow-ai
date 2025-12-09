/**
 * ChatModal Component
 * Full chat interface with conversation history and task suggestions
 */

import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../utils/logger';
import { ParsedTask } from '../../services/openaiService';
import { ChatMessage } from '../../types/chat';
import { ChatMessageBubble } from './ChatModal/ChatMessageBubble';
import { ChatInput } from './ChatModal/ChatInput';
import { TaskSuggestionEditForm } from './ChatModal/TaskSuggestionEditForm';
import { IconAlertCircle } from '../Icons';
import { Button } from '../ui/Button';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ) => Promise<ParsedTask[]>;
  onAddTasks: (tasks: ParsedTask[]) => Promise<void>;
  existingGroups: string[];
}

interface EditableTask extends ParsedTask {
  id: string;
}

export const ChatModal = ({
  isOpen,
  onClose,
  onSendMessage,
  onAddTasks,
  existingGroups,
}: ChatModalProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<EditableTask | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Keep messages for conversation continuity
      // Only reset if explicitly needed
    } else {
      // Optionally clear messages when closing
      // setMessages([]);
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

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

      setMessages((prev) => [...prev, assistantMessage]);
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
  };

  const handleRegenerate = async () => {
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
  };

  const handleTaskAction = async (task: EditableTask, action: 'add' | 'edit' | 'remove') => {
    if (action === 'add') {
      try {
        // If this is a subtask, we need to include its parent in the batch
        const tasksToAdd: ParsedTask[] = [task];

        // If task has parentId, find parent task in the same message
        if (task.parentId) {
          const parentMessage = messages.find((msg) =>
            msg.tasks?.some((t) => t.title === task.parentId)
          );
          if (parentMessage) {
            const parentTask = parentMessage.tasks?.find((t) => t.title === task.parentId);
            if (parentTask && !tasksToAdd.some((t) => t.title === parentTask.title)) {
              tasksToAdd.unshift(parentTask); // Add parent first
            }
          }
        }

        await onAddTasks(tasksToAdd);
        // Update message to show task was added
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.tasks && msg.tasks.some((t) => t.title === task.title)) {
              // Mark task as added (could add visual feedback)
              return msg;
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
      // Remove task from message
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.tasks) {
            const updatedTasks = msg.tasks.filter((t) => t.title !== task.title);
            return {
              ...msg,
              tasks: updatedTasks.length > 0 ? updatedTasks : undefined,
            };
          }
          return msg;
        })
      );
    }
  };

  const handleEditTask = (taskId: string, task: ParsedTask) => {
    setEditingTaskId(taskId);
    setEditedTask({ ...task, id: taskId });
  };

  const handleSaveEdit = () => {
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
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTask(null);
  };

  const handleUpdateEditedTask = (updates: Partial<ParsedTask>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, ...updates });
    }
  };

  // Get last message with tasks for regenerate button
  const lastMessageWithTasks = messages.filter((msg) => msg.tasks && msg.tasks.length > 0).pop();
  const showRegenerate = !!lastMessageWithTasks && !isProcessing;

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t('chat.title')}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-3 flex-shrink-0">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setError(null);
                  if (showRegenerate) {
                    handleRegenerate();
                  }
                }}
                className="text-xs px-2 py-1"
              >
                {t('chat.retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && !isProcessing && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  {t('chat.description')}
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic">
                  {t('chat.example')}
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => {
            // Check if this message has an editing task
            const isEditingThisMessage = editingTaskId && editingTaskId.startsWith(message.id);
            const editingTaskIndex = editingTaskId
              ? parseInt(editingTaskId.split('-task-')[1] || '-1')
              : -1;

            return (
              <div key={message.id}>
                <ChatMessageBubble
                  message={message}
                  onTaskAction={handleTaskAction}
                  onEditTask={handleEditTask}
                />
                {/* Show edit form if editing this message's task */}
                {isEditingThisMessage && editedTask && editingTaskIndex >= 0 && (
                  <div className="mt-2 ml-11">
                    <TaskSuggestionEditForm
                      task={editedTask}
                      existingGroups={existingGroups}
                      onSave={handleSaveEdit}
                      onCancel={handleCancelEdit}
                      onUpdate={handleUpdateEditedTask}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {t('chat.thinking')}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput
          value={currentMessage}
          onChange={setCurrentMessage}
          onSubmit={handleSendMessage}
          onRegenerate={showRegenerate ? handleRegenerate : undefined}
          isProcessing={isProcessing}
          showRegenerate={showRegenerate}
        />
      </div>
    </ResponsiveModal>
  );
};
