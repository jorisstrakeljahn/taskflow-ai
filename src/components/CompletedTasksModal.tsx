import { useMemo } from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskItem } from './TaskItem';
import { getRootTasks, getSubtasks } from '../utils/taskUtils';
import { ResponsiveModal } from './ResponsiveModal';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
  onEdit?: (task: Task) => void;
  parentOffset?: number; // For desktop stacking
}

export const CompletedTasksModal = ({
  isOpen,
  onClose,
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
  onReactivate,
  onEdit,
  parentOffset = 0,
}: CompletedTasksModalProps) => {

  // Filter only completed tasks
  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'done');
  }, [tasks]);

  const rootTasks = useMemo(() => {
    return getRootTasks(completedTasks);
  }, [completedTasks]);

  const handleAddSubtask = (_parentId: string) => {
    // Subtask would be created as new task, but not needed here
    // since we only show completed tasks
  };

  if (!isOpen) return null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Completed Tasks"
      subtitle={`${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}`}
      zIndex={1003}
      offsetRight={parentOffset}
    >
          {rootTasks.length === 0 ? (
            <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
              <p className="mb-2">No completed tasks found.</p>
              <p className="text-sm">
                Completed tasks will appear here once you check them off.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rootTasks.map((task) => {
                const subtasks = getSubtasks(completedTasks, task.id);
                return (
                  <div key={task.id} className="relative">
                    <TaskItem
                      task={task}
                      onStatusChange={onStatusChange}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onAddSubtask={handleAddSubtask}
                      onEdit={onEdit}
                      subtasks={subtasks}
                      disableStatusChange={true}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => onReactivate(task.id)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-accent-light dark:bg-accent-dark text-white hover:opacity-90 transition-opacity"
                        title="Reactivate task"
                      >
                        Reactivate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
    </ResponsiveModal>
  );
};

