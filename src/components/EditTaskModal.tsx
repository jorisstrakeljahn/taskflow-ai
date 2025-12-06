import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { CustomSelect } from './CustomSelect';
import { ResponsiveModal } from './ResponsiveModal';

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

  // Combine existing groups with common default groups, removing duplicates
  const allGroups = Array.from(new Set([...existingGroups, 'General', 'Work', 'Personal', 'Health', 'Finance'])).sort();

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-full"
      >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-task-title"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Title *
            </label>
            <input
              id="edit-task-title"
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
              htmlFor="edit-task-description"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Description
            </label>
            <textarea
              id="edit-task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={4}
              className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-task-status"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Status
            </label>
            <CustomSelect
              id="edit-task-status"
              value={status}
              onChange={(value) => setStatus(value as TaskStatus)}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-task-group"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Group
            </label>
            <div className="flex flex-col gap-2">
              <CustomSelect
                id="edit-task-group"
                value={useCustomGroup ? '' : group}
                onChange={(value) => {
                  setGroup(value);
                  setUseCustomGroup(false);
                }}
                disabled={useCustomGroup}
                options={allGroups.map((g) => ({ value: g, label: g }))}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomGroup}
                  onChange={(e) => {
                    setUseCustomGroup(e.target.checked);
                    if (e.target.checked) {
                      setCustomGroup('');
                    }
                  }}
                  className="w-4 h-4 rounded border-2 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-accent-light dark:text-accent-dark focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                />
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Use custom group
                </span>
              </label>
              {useCustomGroup && (
                <input
                  type="text"
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  placeholder="Enter new group name"
                  className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-task-priority"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Priority
            </label>
            <CustomSelect
              id="edit-task-priority"
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
              Save Changes
            </button>
          </div>
        </form>
    </ResponsiveModal>
  );
};

