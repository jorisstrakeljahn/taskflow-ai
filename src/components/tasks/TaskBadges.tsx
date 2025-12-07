import { Task } from '../../types/task';
import { PRIORITY_COLORS } from '../../constants/uiConstants';

interface TaskBadgesProps {
  task: Task;
}

export const TaskBadges = ({ task }: TaskBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
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
      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
        {task.status}
      </span>
    </div>
  );
};

