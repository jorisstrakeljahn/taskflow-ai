import React, { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus } from '../../types/task';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { TaskFormFields } from '../ui/TaskFormFields';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../utils/logger';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    group: string;
    priority?: TaskPriority;
    parentId?: string;
  }) => Promise<void> | void;
  parentId?: string;
  parentTaskTitle?: string;
  isSubModal?: boolean;
  parentModalRef?: React.RefObject<HTMLDivElement>;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  parentId,
  parentTaskTitle,
  isSubModal = false,
  parentModalRef,
}: CreateTaskModalProps) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('open');
  const [group, setGroup] = useState('General');
  const [priority, setPriority] = useState<TaskPriority | ''>('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setStatus('open');
      setGroup('General');
      setPriority('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      try {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          group,
          priority: priority || undefined,
          parentId,
        });
        onClose();
      } catch (error) {
        // Error is handled in App.tsx, but don't close modal on error
        logger.error('Error in handleSubmit:', error);
      }
    }
  };

  const modalTitle = parentId
    ? `${t('modals.createSubtask.title')} "${parentTaskTitle || ''}"`
    : t('modals.createTask.title');

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      zIndex={isSubModal ? 1002 : 1001}
      offsetRight={isSubModal ? 500 : 0}
      level={isSubModal ? 2 : 1}
      parentModalRef={isSubModal ? parentModalRef : undefined}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
        <TaskFormFields
          title={title}
          description={description}
          status={status}
          group={group}
          priority={priority}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onStatusChange={setStatus}
          onGroupChange={setGroup}
          onPriorityChange={(value) => setPriority(value as TaskPriority | '')}
          showStatus={true}
        />

        <div className={`flex gap-2 pt-2 mt-4 ${parentId ? 'pb-6' : ''}`}>
          {!parentId && (
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              {t('common.cancel')}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className={parentId ? 'text-sm py-2 min-h-[40px]' : ''}
          >
            {parentId ? t('modals.createSubtask.create') : t('modals.createTask.create')}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};
