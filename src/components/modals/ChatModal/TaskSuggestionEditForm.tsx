/**
 * TaskSuggestionEditForm Component
 * Form for editing a task suggestion before adding it
 */

import React from 'react';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { CustomSelect } from '../../ui/CustomSelect';
import { Button } from '../../ui/Button';
import { IconCheck, IconX } from '../../Icons';
import { ParsedTask } from '../../../services/openaiService';
import { TaskPriority } from '../../../types/task';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TaskSuggestionEditFormProps {
  task: ParsedTask & { id: string };
  existingGroups: string[];
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (updates: Partial<ParsedTask>) => void;
}

export const TaskSuggestionEditForm = ({
  task,
  existingGroups,
  onSave,
  onCancel,
  onUpdate,
}: TaskSuggestionEditFormProps) => {
  const { t } = useLanguage();

  const priorityOptions: { value: TaskPriority | ''; label: string }[] = [
    { value: '', label: t('priority.none') },
    { value: 'low', label: t('priority.low') },
    { value: 'medium', label: t('priority.medium') },
    { value: 'high', label: t('priority.high') },
  ];

  const groupOptions = [
    { value: '', label: t('filters.allGroups') },
    ...existingGroups.map((group) => ({ value: group, label: group })),
  ];

  return (
    <div className="bg-card-light dark:bg-card-dark border-2 border-accent-light dark:border-accent-dark rounded-lg p-4 space-y-3">
      <div className="space-y-2">
        <Input
          value={task.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={t('task.title')}
          className="font-semibold"
        />
        <Textarea
          value={task.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value || undefined })}
          placeholder={t('task.description')}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-2">
          <CustomSelect
            value={task.group}
            onChange={(value) => onUpdate({ group: value })}
            options={groupOptions}
            placeholder={t('task.group')}
          />
          <CustomSelect
            value={task.priority || ''}
            onChange={(value) =>
              onUpdate({ priority: value ? (value as TaskPriority) : undefined })
            }
            options={priorityOptions}
            placeholder={t('task.priority')}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" onClick={onSave} className="flex-1">
          <IconCheck className="w-4 h-4 mr-1.5" />
          {t('chat.saveTask')}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          <IconX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
