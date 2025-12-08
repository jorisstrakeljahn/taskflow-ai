import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../utils/logger';
import { ParsedTask } from '../../services/openaiService';
import { IconRefreshCw, IconPlus, IconAlertCircle } from '../Icons';
import { TaskSuggestionItem } from './ChatModal/TaskSuggestionItem';
import { TaskSuggestionEditForm } from './ChatModal/TaskSuggestionEditForm';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<ParsedTask[]>;
  onAddTasks: (tasks: ParsedTask[]) => Promise<void>;
  existingGroups: string[];
}

interface EditableTask extends ParsedTask {
  id: string; // Temporary ID for editing
  isEditing?: boolean;
}

export const ChatModal = ({
  isOpen,
  onClose,
  onSendMessage,
  onAddTasks,
  existingGroups,
}: ChatModalProps) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<EditableTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<EditableTask | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setSuggestions([]);
      setError(null);
      setEditingTaskId(null);
      setEditedTask(null);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Scroll to suggestions when they appear
  useEffect(() => {
    if (suggestions.length > 0 && suggestionsRef.current) {
      setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [suggestions.length]);

  const generateTaskId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      setIsProcessing(true);
      setError(null);
      try {
        const tasks = await onSendMessage(message.trim());
        const editableTasks: EditableTask[] = tasks.map((task) => ({
          ...task,
          id: generateTaskId(),
        }));
        setSuggestions(editableTasks);
      } catch (err) {
        logger.error('Error generating tasks:', err);
        const errorMessage = err instanceof Error ? err.message : t('chat.error');
        setError(errorMessage);
        setSuggestions([]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRegenerate = async () => {
    if (message.trim() && !isProcessing) {
      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = suggestions.find((t) => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setEditedTask({ ...task });
    }
  };

  const handleSaveEdit = () => {
    if (editedTask && editingTaskId) {
      setSuggestions((prev) =>
        prev.map((task) => (task.id === editingTaskId ? { ...editedTask, isEditing: false } : task))
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

  const handleRemoveTask = (taskId: string) => {
    setSuggestions((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleAddTask = async (task: EditableTask) => {
    try {
      await onAddTasks([task]);
      setSuggestions((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      logger.error('Error adding task:', err);
    }
  };

  const handleAddAll = async () => {
    if (suggestions.length === 0) return;
    try {
      await onAddTasks(suggestions);
      setSuggestions([]);
      setMessage('');
    } catch (err) {
      logger.error('Error adding tasks:', err);
    }
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t('chat.title')}>
      <div className="flex flex-col gap-4 h-full overflow-hidden">
        {/* Info Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex-shrink-0">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
            {t('chat.description')}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic">
            {t('chat.example')}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex-shrink-0">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  {t('chat.error')}
                </p>
                <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
                {error.includes('API key') && (
                  <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                    {t('chat.apiKeyMissingDescription')}
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setError(null);
                  if (message.trim()) {
                    handleRegenerate();
                  }
                }}
                className="text-xs px-3 py-1.5"
              >
                {t('chat.retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-shrink-0">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chat.placeholder')}
              rows={4}
              disabled={isProcessing}
              className="pr-20"
            />
            {suggestions.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleRegenerate}
                disabled={isProcessing || !message.trim()}
                className="absolute bottom-2 right-2 px-3 py-1.5 text-xs"
                title={t('chat.regenerate')}
              >
                <IconRefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!message.trim() || isProcessing}
          >
            {isProcessing ? t('chat.processing') : t('chat.createTasks')}
          </Button>
        </form>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div ref={suggestionsRef} className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {t('chat.suggestions')}
                  </h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {t('chat.suggestionsDescription')}
                  </p>
                </div>
                <Button variant="primary" onClick={handleAddAll} className="text-sm px-4 py-2">
                  <IconPlus className="w-4 h-4 mr-1.5" />
                  {t('chat.addAll')}
                </Button>
              </div>

              <div className="space-y-3">
                {suggestions.map((task) => {
                  const isEditing = editingTaskId === task.id;

                  if (isEditing && editedTask) {
                    return (
                      <TaskSuggestionEditForm
                        key={task.id}
                        task={editedTask}
                        existingGroups={existingGroups}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        onUpdate={handleUpdateEditedTask}
                      />
                    );
                  }

                  return (
                    <TaskSuggestionItem
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onRemove={handleRemoveTask}
                      onAdd={handleAddTask}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {suggestions.length === 0 && !isProcessing && !error && message.trim() && (
          <div className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
            <p className="text-sm">{t('chat.noSuggestions')}</p>
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
};
