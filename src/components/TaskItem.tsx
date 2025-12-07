import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskCheckbox, TaskBadges, TaskActions } from './tasks';

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
        <TaskCheckbox
          checked={task.status === 'done'}
          onChange={handleCheckboxChange}
          disabled={disableStatusChange}
          showCheckmark={showCheckmark}
        />
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
              <TaskBadges task={task} />
            </div>
            <TaskActions
              onAddSubtask={onAddSubtask}
              onEdit={onEdit ? () => onEdit(task) : undefined}
              onDelete={() => onDelete(task.id)}
              parentId={task.id}
            />
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
