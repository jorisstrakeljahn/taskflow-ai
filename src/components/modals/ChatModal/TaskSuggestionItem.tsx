/**
 * TaskSuggestionItem Component
 * Displays a single task suggestion with edit/remove/add actions
 */

import React from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { IconEdit2, IconTrash2, IconPlus } from '../../Icons';
import { ParsedTask } from '../../../services/openaiService';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TaskSuggestionItemProps {
  task: ParsedTask & { id: string };
  onEdit: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  onAdd: (task: ParsedTask & { id: string }) => void;
}

export const TaskSuggestionItem = ({ task, onEdit, onRemove, onAdd }: TaskSuggestionItemProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{task.group}</Badge>
            {task.priority && (
              <Badge
                variant={
                  task.priority === 'high'
                    ? 'danger'
                    : task.priority === 'medium'
                      ? 'warning'
                      : 'default'
                }
              >
                {t(`priority.${task.priority}`)}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="secondary"
            onClick={() => onEdit(task.id)}
            className="p-1.5"
            title={t('chat.editTask')}
          >
            <IconEdit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => onRemove(task.id)}
            className="p-1.5"
            title={t('chat.removeTask')}
          >
            <IconTrash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="primary"
            onClick={() => onAdd(task)}
            className="p-1.5"
            title={t('chat.addTask')}
          >
            <IconPlus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
