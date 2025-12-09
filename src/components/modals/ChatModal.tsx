/**
 * ChatModal Component
 *
 * Full chat interface with conversation history and AI-powered task suggestions.
 * Allows users to interact with AI to generate tasks from natural language.
 * Displays conversation history, task suggestions, and provides editing capabilities.
 *
 * @param isOpen - Whether the modal is open
 * @param onClose - Handler to close the modal
 * @param onSendMessage - Function to send messages to OpenAI API
 * @param onAddTasks - Function to add parsed tasks to the task list
 * @param existingGroups - Array of existing task groups for AI context
 *
 * @example
 * ```tsx
 * <ChatModal
 *   isOpen={isChatOpen}
 *   onClose={() => setIsChatOpen(false)}
 *   onSendMessage={generateTasksFromMessage}
 *   onAddTasks={addTasksToFirebase}
 *   existingGroups={['Work', 'Personal']}
 * />
 * ```
 */

import React from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { ParsedTask } from '../../services/openaiService';
import { ChatInput } from './ChatModal/ChatInput';
import { ChatErrorBanner } from './ChatModal/ChatErrorBanner';
import { ChatMessagesContainer } from './ChatModal/ChatMessagesContainer';
import { IconRefreshCw } from '../Icons';
import { useChatState } from './ChatModal/hooks/useChatState';

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

export const ChatModal = ({
  isOpen,
  onClose,
  onSendMessage,
  onAddTasks,
  existingGroups,
}: ChatModalProps) => {
  const { t } = useLanguage();

  const {
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
  } = useChatState({
    onSendMessage,
    onAddTasks,
  });

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('chat.title')}
      headerActions={
        <button
          onClick={handleResetChat}
          className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={t('chat.resetChat')}
          aria-label={t('chat.resetChat')}
        >
          <IconRefreshCw className="w-5 h-5" />
        </button>
      }
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Error Banner */}
        {error && (
          <ChatErrorBanner
            error={error}
            onRetry={showRegenerate ? handleRegenerate : undefined}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Messages Container */}
        <ChatMessagesContainer
          messages={messages}
          isProcessing={isProcessing}
          editingTaskId={editingTaskId}
          editedTask={editedTask}
          existingGroups={existingGroups}
          onTaskAction={handleTaskAction}
          onEditTask={handleEditTask}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onUpdateEditedTask={handleUpdateEditedTask}
          messagesEndRef={messagesEndRef}
        />

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
