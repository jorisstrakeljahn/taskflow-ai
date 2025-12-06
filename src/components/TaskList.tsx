import { useMemo, useState } from 'react';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import {
  getRootTasks,
  getSubtasks,
  getTasksByGroup,
  getTasksByStatus,
} from '../utils/taskUtils';
import { TaskFilters } from './TaskFilters';

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
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const groups = useMemo(() => {
    const uniqueGroups = Array.from(new Set(tasks.map((t) => t.group)));
    return uniqueGroups.sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (filterStatus === 'done') {
      // Only show completed tasks
      filtered = getTasksByStatus(filtered, 'done');
    } else if (filterStatus !== 'all') {
      // Filter by specific status and exclude completed tasks
      filtered = getTasksByStatus(filtered, filterStatus as Task['status']);
    } else {
      // Show all except completed tasks when "all" is selected
      filtered = filtered.filter((t) => t.status !== 'done');
    }

    // Filter by group
    if (filterGroup !== 'all') {
      filtered = getTasksByGroup(filtered, filterGroup);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    return filtered;
  }, [tasks, filterGroup, filterStatus, filterPriority]);

  const handleResetFilters = () => {
    setFilterGroup('all');
    setFilterStatus('all');
    setFilterPriority('all');
  };

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
      <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 mb-4">
        <TaskFilters
          filterGroup={filterGroup}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          groups={groups}
          onGroupChange={setFilterGroup}
          onStatusChange={setFilterStatus}
          onPriorityChange={setFilterPriority}
          onReset={handleResetFilters}
        />
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
