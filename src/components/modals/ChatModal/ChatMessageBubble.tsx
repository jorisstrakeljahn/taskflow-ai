/**
 * ChatMessageBubble Component
 * Displays a single chat message (user or assistant)
 */

import React from 'react';
import { ChatMessage } from '../../../types/chat';
import { ParsedTask } from '../../../services/openaiService';
import { useLanguage } from '../../../contexts/LanguageContext';
import { IconUser, IconBot } from '../../Icons';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onTaskAction?: (task: ParsedTask & { id: string }, action: 'add' | 'edit' | 'remove') => void;
  onEditTask?: (taskId: string, task: ParsedTask) => void;
  existingGroups?: string[];
}

export const ChatMessageBubble = ({
  message,
  onTaskAction,
  onEditTask,
}: ChatMessageBubbleProps) => {
  const { t } = useLanguage();
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-accent-light dark:bg-accent-dark text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        {isUser ? <IconUser className="w-4 h-4" /> : <IconBot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {/* Text Content */}
        {message.content && (
          <div
            className={`rounded-lg px-4 py-2 max-w-[85%] ${
              isUser
                ? 'bg-accent-light dark:bg-accent-dark text-white'
                : 'bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        )}

        {/* Tasks (only for assistant messages) */}
        {!isUser && message.tasks && message.tasks.length > 0 && (
          <div className="w-full space-y-2">
            {(() => {
              // Separate parent tasks and subtasks
              const parentTasks = message.tasks!.filter((task) => !task.parentId);
              const subtasksByParent = new Map<string, typeof message.tasks>();

              message.tasks!.forEach((task) => {
                if (task.parentId) {
                  const existing = subtasksByParent.get(task.parentId) || [];
                  subtasksByParent.set(task.parentId, [...existing, task]);
                }
              });

              return parentTasks.map((task, index) => {
                const taskId = `${message.id}-task-${index}`;
                const subtasks = subtasksByParent.get(task.title) || [];

                return (
                  <div key={taskId} className="space-y-2">
                    {/* Parent Task */}
                    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-3">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            {task.group}
                          </span>
                          {task.priority && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.priority === 'high'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  : task.priority === 'medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              }`}
                            >
                              {t(`priority.${task.priority}`)}
                            </span>
                          )}
                          {subtasks.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                              {subtasks.length}{' '}
                              {subtasks.length === 1 ? t('task.subtask') : t('task.subtasks')}
                            </span>
                          )}
                        </div>
                        {onTaskAction && (
                          <div className="flex gap-2 pt-2 border-t border-border-light dark:border-border-dark">
                            <button
                              onClick={() => onTaskAction({ ...task, id: taskId }, 'add')}
                              className="text-xs px-3 py-1.5 bg-accent-light dark:bg-accent-dark text-white rounded hover:opacity-90 transition-opacity"
                            >
                              {t('chat.addTask')}
                            </button>
                            {onEditTask && (
                              <button
                                onClick={() => onEditTask(taskId, task)}
                                className="text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                {t('chat.editTask')}
                              </button>
                            )}
                            <button
                              onClick={() => onTaskAction({ ...task, id: taskId }, 'remove')}
                              className="text-xs px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              {t('chat.removeTask')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subtasks */}
                    {subtasks.length > 0 && (
                      <div className="ml-4 space-y-2 border-l-2 border-border-light dark:border-border-dark pl-3">
                        {subtasks.map((subtask, subtaskIndex) => {
                          const subtaskId = `${taskId}-subtask-${subtaskIndex}`;
                          return (
                            <div
                              key={subtaskId}
                              className="bg-gray-50 dark:bg-gray-900/50 border border-border-light dark:border-border-dark rounded-lg p-2.5"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                    ↳
                                  </span>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-xs text-text-primary-light dark:text-text-primary-dark">
                                      {subtask.title}
                                    </h5>
                                    {subtask.description && (
                                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                        {subtask.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 items-center ml-3">
                                  {subtask.priority && (
                                    <span
                                      className={`text-xs px-1.5 py-0.5 rounded ${
                                        subtask.priority === 'high'
                                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                          : subtask.priority === 'medium'
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                      }`}
                                    >
                                      {t(`priority.${subtask.priority}`)}
                                    </span>
                                  )}
                                </div>
                                {onTaskAction && (
                                  <div className="flex gap-1.5 pt-1.5 border-t border-border-light dark:border-border-dark ml-3">
                                    <button
                                      onClick={() =>
                                        onTaskAction({ ...subtask, id: subtaskId }, 'add')
                                      }
                                      className="text-xs px-2 py-1 bg-accent-light dark:bg-accent-dark text-white rounded hover:opacity-90 transition-opacity"
                                    >
                                      {t('chat.addTask')}
                                    </button>
                                    {onEditTask && (
                                      <button
                                        onClick={() => onEditTask(subtaskId, subtask)}
                                        className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                      >
                                        {t('chat.editTask')}
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        onTaskAction({ ...subtask, id: subtaskId }, 'remove')
                                      }
                                      className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    >
                                      {t('chat.removeTask')}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
