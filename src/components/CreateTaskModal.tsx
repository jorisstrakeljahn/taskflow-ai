import { useState, useEffect } from 'react';
import { TaskPriority } from '../types/task';
import { ResponsiveModal } from './ResponsiveModal';
import { TaskFormFields } from './ui/TaskFormFields';
import { Button } from './ui/Button';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    group: string;
    priority?: TaskPriority;
  }) => void;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('General');
  const [priority, setPriority] = useState<TaskPriority | ''>('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setGroup('General');
      setPriority('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        group,
        priority: priority || undefined,
      });
      onClose();
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-full"
      >
        <TaskFormFields
          title={title}
          description={description}
          group={group}
          priority={priority}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onGroupChange={setGroup}
          onPriorityChange={(value) => setPriority(value as TaskPriority | '')}
        />

        <div className="flex gap-3 pt-2 mt-4">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" fullWidth>
            Create
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};
