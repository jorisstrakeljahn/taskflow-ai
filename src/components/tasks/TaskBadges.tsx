import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { StatusSelector } from './StatusSelector';
import { PrioritySelector } from './PrioritySelector';
import { formatDate, isOverdue, isToday } from '../../utils/dateUtils';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { t } = useLanguage();

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
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex flex-wrap gap-2 items-center">
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
      {/* Date Information - Minimalist display */}
      {(task.dueDate || task.createdAt || (task.completedAt && task.status === 'done')) && (
        <div className="flex flex-wrap gap-2 text-xs text-text-tertiary-light dark:text-text-tertiary-dark mt-1">
          {task.dueDate && (
            <span
              className={
                isOverdue(task.dueDate) && task.status !== 'done'
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : isToday(task.dueDate) && task.status !== 'done'
                    ? 'text-orange-600 dark:text-orange-400 font-medium'
                    : ''
              }
            >
              {t('task.dueDate')}: {formatDate(task.dueDate)}
              {isOverdue(task.dueDate) && task.status !== 'done' && ' • Overdue'}
            </span>
          )}
          {task.createdAt && (
            <span className="opacity-70">
              {t('task.createdAt')}: {formatDate(task.createdAt)}
            </span>
          )}
          {task.completedAt && task.status === 'done' && (
            <span className="opacity-70">
              {t('task.completedAt')}: {formatDate(task.completedAt)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
