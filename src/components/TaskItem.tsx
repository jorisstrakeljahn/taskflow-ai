import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { IconEdit, IconTrash } from './Icons';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddSubtask?: (parentId: string) => void;
  subtasks?: Task[];
  level?: number;
}

export const TaskItem = ({
  task,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
  subtasks = [],
  level = 0,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ''
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(task.status === 'done');

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription || undefined,
    });
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'text-gray-500 dark:text-gray-400',
    medium: 'text-amber-600 dark:text-amber-400',
    high: 'text-red-600 dark:text-red-400',
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? 'done' : 'open';
    if (newStatus === 'done') {
      // Zuerst den Haken anzeigen
      setShowCheckmark(true);
      // Kurz warten, damit der Haken sichtbar ist (300ms)
      setTimeout(() => {
        // Dann die Verschwind-Animation starten
        setIsCompleting(true);
        // Nach der Animation den Status aktualisieren
        setTimeout(() => {
          onStatusChange(task.id, newStatus);
          // Animation zurücksetzen nach kurzer Pause
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
            className="w-5 h-5 cursor-pointer rounded border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-0 transition-all duration-200 appearance-none checked:bg-accent-light dark:checked:bg-accent-dark checked:border-accent-light dark:checked:border-accent-dark checked:scale-110"
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
        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="px-2 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="px-2 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
              placeholder="Beschreibung (optional)"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-accent-light dark:bg-accent-dark text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditDescription(task.description || '');
                }}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
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
                  title="Subtask hinzufügen"
                >
                  +
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Bearbeiten"
              >
                <IconEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Löschen"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
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
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
