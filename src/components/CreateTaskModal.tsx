import { useState, useEffect } from 'react';
import { TaskPriority } from '../types/task';
import { CustomSelect } from './CustomSelect';
import { ResponsiveModal } from './ResponsiveModal';

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

const GROUPS = ['General', 'Work', 'Personal', 'Health', 'Finance'];

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
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-title"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare presentation"
              required
              autoFocus
              className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-description"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={4}
              className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-group"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Group
              </label>
              <CustomSelect
                id="task-group"
                value={group}
                onChange={(value) => setGroup(value)}
                options={GROUPS.map((g) => ({ value: g, label: g }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-priority"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Priority
              </label>
              <CustomSelect
                id="task-priority"
                value={priority}
                onChange={(value) => setPriority(value as TaskPriority | '')}
                options={[
                  { value: '', label: 'None' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-accent-light dark:bg-accent-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create
            </button>
          </div>
        </form>
    </ResponsiveModal>
  );
};
