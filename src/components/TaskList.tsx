import { useMemo, useState } from 'react';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import {
  getRootTasks,
  getSubtasks,
  getTasksByGroup,
  getTasksByStatus,
} from '../utils/taskUtils';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Task['status']) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string, title: string) => void;
}

export const TaskList = ({
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
}: TaskListProps) => {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const groups = useMemo(() => {
    const uniqueGroups = Array.from(new Set(tasks.map((t) => t.group)));
    return uniqueGroups.sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (filterGroup !== 'all') {
      filtered = getTasksByGroup(filtered, filterGroup);
    }

    if (filterStatus !== 'all') {
      filtered = getTasksByStatus(filtered, filterStatus as Task['status']);
    }

    if (!showCompleted) {
      filtered = filtered.filter((t) => t.status !== 'done');
    }

    return filtered;
  }, [tasks, filterGroup, filterStatus, showCompleted]);

  const rootTasks = useMemo(() => {
    return getRootTasks(filteredTasks);
  }, [filteredTasks]);

  const handleAddSubtask = (parentId: string) => {
    const title = prompt('Subtask Titel:');
    if (title) {
      onAddSubtask(parentId, title);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="group-filter"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap"
              >
                Gruppe:
              </label>
              <select
                id="group-filter"
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="flex-1 px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark min-h-[44px]"
              >
                <option value="all">Alle</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap"
              >
                Status:
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark min-h-[44px]"
              >
                <option value="all">Alle</option>
                <option value="open">Offen</option>
                <option value="in_progress">In Bearbeitung</option>
                <option value="done">Erledigt</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-completed"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 rounded border-border-light dark:border-border-dark"
            />
            <label
              htmlFor="show-completed"
              className="text-sm text-text-secondary-light dark:text-text-secondary-dark cursor-pointer"
            >
              Erledigte anzeigen
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rootTasks.length === 0 ? (
          <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
            <p className="mb-2">Keine Tasks gefunden.</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Nutze den Chat, um neue Tasks zu erstellen!
            </p>
          </div>
        ) : (
          rootTasks.map((task) => {
            const subtasks = getSubtasks(filteredTasks, task.id);
            return (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddSubtask={handleAddSubtask}
                subtasks={subtasks}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
