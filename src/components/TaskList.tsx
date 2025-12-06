import { useMemo, useState } from 'react';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import { CustomSelect } from './CustomSelect';
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
  onEdit?: (task: Task) => void;
}

export const TaskList = ({
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
  onEdit,
}: TaskListProps) => {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const groups = useMemo(() => {
    const uniqueGroups = Array.from(new Set(tasks.map((t) => t.group)));
    return uniqueGroups.sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Always hide completed tasks (except when explicitly filtering for "done")
    if (filterStatus !== 'done') {
      filtered = filtered.filter((t) => t.status !== 'done');
    }

    if (filterGroup !== 'all') {
      filtered = getTasksByGroup(filtered, filterGroup);
    }

    if (filterStatus !== 'all' && filterStatus !== 'done') {
      filtered = getTasksByStatus(filtered, filterStatus as Task['status']);
    }

    return filtered;
  }, [tasks, filterGroup, filterStatus]);

  const rootTasks = useMemo(() => {
    return getRootTasks(filteredTasks);
  }, [filteredTasks]);

  const handleAddSubtask = (parentId: string) => {
    const title = prompt('Subtask title:');
    if (title) {
      onAddSubtask(parentId, title);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="group-filter"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Group
              </label>
              <CustomSelect
                id="group-filter"
                value={filterGroup}
                onChange={(value) => setFilterGroup(value)}
                options={[
                  { value: 'all', label: 'All' },
                  ...groups.map((group) => ({ value: group, label: group })),
                ]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Status
              </label>
              <CustomSelect
                id="status-filter"
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'open', label: 'Open' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'done', label: 'Done' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rootTasks.length === 0 ? (
          <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
            <p className="mb-2">No tasks found.</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Use the chat to create new tasks!
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
                onEdit={onEdit}
                subtasks={subtasks}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
