import { useMemo } from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskItem } from './TaskItem';
import { getRootTasks, getSubtasks } from '../utils/taskUtils';
import { ResponsiveModal } from './ResponsiveModal';
import { Button } from './ui/Button';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
  onEdit?: (task: Task) => void;
  parentModalRef?: React.RefObject<HTMLDivElement>; // Reference to parent modal
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
  parentModalRef,
}: CompletedTasksModalProps) => {

  // Filter only completed tasks
  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'done');
  }, [tasks]);

  const rootTasks = useMemo(() => {
    return getRootTasks(completedTasks);
  }, [completedTasks]);

  // Note: Subtasks for completed tasks are read-only, so we don't need to handle adding them

  if (!isOpen) return null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Completed Tasks"
      subtitle={`${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}`}
      zIndex={1003}
      offsetRight={500}
      level={2}
      parentModalRef={parentModalRef}
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
                      onEdit={onEdit}
                      subtasks={subtasks}
                      disableStatusChange={true}
                    />
                        <div className="mt-2 flex justify-end">
                          <Button
                            variant="primary"
                            onClick={() => onReactivate(task.id)}
                            title="Reactivate task"
                          >
                            Reactivate
                          </Button>
                        </div>
                  </div>
                );
              })}
            </div>
          )}
    </ResponsiveModal>
  );
};

