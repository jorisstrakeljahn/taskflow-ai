import { Task, TaskStatus } from '../../types/task';
import { PRIORITY_COLORS } from '../../constants/uiConstants';
import { StatusSelector } from './StatusSelector';

interface TaskBadgesProps {
  task: Task;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  disableStatusChange?: boolean;
}

export const TaskBadges = ({ 
  task, 
  onStatusChange,
  disableStatusChange = false,
}: TaskBadgesProps) => {
  const handleStatusChange = (status: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, status);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2 items-center">
      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
        {task.group}
      </span>
      {task.priority && (
        <span
          className={`px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 font-semibold ${task.priority ? PRIORITY_COLORS[task.priority] : ''}`}
        >
          {task.priority}
        </span>
      )}
      <StatusSelector
        currentStatus={task.status}
        onStatusChange={handleStatusChange}
        disabled={disableStatusChange || !onStatusChange}
      />
    </div>
  );
};

