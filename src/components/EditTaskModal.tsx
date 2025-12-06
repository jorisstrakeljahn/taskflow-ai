import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { ResponsiveModal } from './ResponsiveModal';
import { TaskFormFields } from './ui/TaskFormFields';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  existingGroups: string[];
  onSubmit: (id: string, data: {
    title: string;
    description?: string;
    status: TaskStatus;
    group: string;
    priority?: TaskPriority;
  }) => void;
}

export const EditTaskModal = ({
  isOpen,
  onClose,
  task,
  existingGroups,
  onSubmit,
}: EditTaskModalProps) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('open');
  const [group, setGroup] = useState('General');
  const [customGroup, setCustomGroup] = useState('');
  const [useCustomGroup, setUseCustomGroup] = useState(false);
  const [priority, setPriority] = useState<TaskPriority | ''>('');

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setGroup(task.group);
      setCustomGroup('');
      setUseCustomGroup(false);
      setPriority(task.priority || '');
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && task) {
      const selectedGroup = useCustomGroup && customGroup.trim() 
        ? customGroup.trim() 
        : group;
      
      onSubmit(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        group: selectedGroup,
        priority: priority || undefined,
      });
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modals.editTask.title')}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-full"
      >
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
          existingGroups={existingGroups}
          showCustomGroup={true}
          customGroup={customGroup}
          onCustomGroupChange={setCustomGroup}
          useCustomGroup={useCustomGroup}
          onUseCustomGroupChange={setUseCustomGroup}
          showStatus={true}
          titleId="edit-task-title"
          descriptionId="edit-task-description"
          statusId="edit-task-status"
          groupId="edit-task-group"
          priorityId="edit-task-priority"
        />

        <div className="flex gap-3 pt-2 mt-4">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" fullWidth>
            {t('modals.editTask.saveChanges')}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

