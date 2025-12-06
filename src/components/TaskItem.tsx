import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { IconEdit, IconTrash } from './Icons';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddSubtask?: (parentId: string) => void;
  onEdit?: (task: Task) => void;
  subtasks?: Task[];
  level?: number;
  disableStatusChange?: boolean;
}

export const TaskItem = ({
  task,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
  onEdit,
  subtasks = [],
  level = 0,
  disableStatusChange = false,
}: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(task.status === 'done');

  const priorityColors = {
    low: 'text-gray-500 dark:text-gray-400',
    medium: 'text-amber-600 dark:text-amber-400',
    high: 'text-red-600 dark:text-red-400',
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disableStatusChange) {
      // Prevent status change when disabled
      e.preventDefault();
      return;
    }
    
    const newStatus = e.target.checked ? 'done' : 'open';
    if (newStatus === 'done') {
      // First show the checkmark
      setShowCheckmark(true);
      // Wait briefly so the checkmark is visible (300ms)
      setTimeout(() => {
        // Then start the fade-out animation
        setIsCompleting(true);
        // Update status after animation
        setTimeout(() => {
          onStatusChange(task.id, newStatus);
          // Reset animation after short pause
          setTimeout(() => {
            setIsCompleting(false);
          }, 100);
        }, 400);
      }, 300);
    } else {
      setShowCheckmark(false);
      setIsCompleting(false);
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <div
      className={`bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-3 mb-2 transition-all duration-500 ${
        task.status === 'done' && !isCompleting
          ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50'
          : 'hover:shadow-sm'
      } ${
        isCompleting 
          ? 'scale-95 opacity-0 transform transition-all duration-500 ease-out' 
          : 'scale-100 opacity-100'
      }`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={task.status === 'done' || showCheckmark}
            onChange={handleCheckboxChange}
            disabled={disableStatusChange}
            className={`w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-0 transition-all duration-200 appearance-none checked:bg-accent-light dark:checked:bg-accent-dark checked:border-accent-light dark:checked:border-accent-dark checked:scale-110 ${
              disableStatusChange 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
            }`}
          />
          {(task.status === 'done' || showCheckmark) && (
            <svg
              className="absolute top-0 left-0 w-5 h-5 pointer-events-none text-white animate-in fade-in zoom-in duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <>
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span
                className={`block font-semibold text-base mb-1 ${
                  task.status === 'done'
                    ? 'line-through text-text-secondary-light dark:text-text-secondary-dark'
                    : 'text-text-primary-light dark:text-text-primary-dark'
                }`}
              >
                {task.title}
              </span>
              {task.description && (
                <span className="block text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2 line-clamp-2">
                  {task.description}
                </span>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
                  {task.group}
                </span>
                {task.priority && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 font-semibold ${priorityColors[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                )}
                <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
                  {task.status}
                </span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {onAddSubtask && (
                <button
                  onClick={() => onAddSubtask(task.id)}
                  className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Add subtask"
                >
                  +
                </button>
              )}
              <button
                onClick={() => onEdit && onEdit(task)}
                className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Edit"
              >
                <IconEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
        </>
      </div>
      {isExpanded && task.description && (
        <div className="mt-2 pt-2 border-t border-border-light dark:border-border-dark text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {task.description}
        </div>
      )}
      {subtasks.length > 0 && (
        <div className="mt-3 pl-3 border-l-2 border-border-light dark:border-border-dark">
          {subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onStatusChange={onStatusChange}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
              level={level + 1}
              disableStatusChange={disableStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
