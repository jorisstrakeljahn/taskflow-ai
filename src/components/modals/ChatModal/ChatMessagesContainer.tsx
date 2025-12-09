/**
 * ChatMessagesContainer Component
 * Container for displaying chat messages
 */

import React from 'react';
import { ChatMessage } from '../../../types/chat';
import { ParsedTask } from '../../../services/openaiService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { TaskSuggestionEditForm } from './TaskSuggestionEditForm';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';

interface EditableTask extends ParsedTask {
  id: string;
}

interface ChatMessagesContainerProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  editingTaskId: string | null;
  editedTask: EditableTask | null;
  existingGroups: string[];
  onTaskAction?: (task: EditableTask, action: 'add' | 'edit' | 'remove') => void;
  onEditTask?: (taskId: string, task: ParsedTask) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onUpdateEditedTask: (updates: Partial<ParsedTask>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessagesContainer = ({
  messages,
  isProcessing,
  editingTaskId,
  editedTask,
  existingGroups,
  onTaskAction,
  onEditTask,
  onSaveEdit,
  onCancelEdit,
  onUpdateEditedTask,
  messagesEndRef,
}: ChatMessagesContainerProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {messages.length === 0 && !isProcessing && <ChatEmptyState />}

      {messages.map((message) => {
        // Check if this message has an editing task
        const isEditingThisMessage = editingTaskId && editingTaskId.startsWith(message.id);
        const editingTaskIndex = editingTaskId
          ? parseInt(editingTaskId.split('-task-')[1] || '-1')
          : -1;

        // Skip messages with no tasks and no content (empty assistant messages)
        if (!message.content && (!message.tasks || message.tasks.length === 0)) {
          return null;
        }

        return (
          <div key={message.id}>
            <ChatMessageBubble
              message={message}
              onTaskAction={onTaskAction}
              onEditTask={onEditTask}
            />
            {/* Show edit form if editing this message's task */}
            {isEditingThisMessage && editedTask && editingTaskIndex >= 0 && (
              <div className="mt-2 ml-11">
                <TaskSuggestionEditForm
                  task={editedTask}
                  existingGroups={existingGroups}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                  onUpdate={onUpdateEditedTask}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Processing indicator */}
      {isProcessing && <ChatProcessingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};
