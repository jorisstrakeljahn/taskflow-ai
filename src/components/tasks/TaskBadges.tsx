import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { StatusSelector } from './StatusSelector';
import { PrioritySelector } from './PrioritySelector';

interface TaskBadgesProps {
  task: Task;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  disableStatusChange?: boolean;
}

export const TaskBadges = ({
  task,
  onStatusChange,
  onUpdate,
  disableStatusChange = false,
}: TaskBadgesProps) => {
  const handleStatusChange = (status: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, status);
    }
  };

  const handlePriorityChange = (priority: TaskPriority | '') => {
    if (onUpdate) {
      onUpdate(task.id, { priority: priority || undefined });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2 items-center">
      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
        {task.group}
      </span>
      <PrioritySelector
        currentPriority={task.priority || ''}
        onPriorityChange={handlePriorityChange}
        disabled={disableStatusChange || !onUpdate}
      />
      <StatusSelector
        currentStatus={task.status}
        onStatusChange={handleStatusChange}
        disabled={disableStatusChange || !onStatusChange}
      />
    </div>
  );
};
