import React, { useMemo } from 'react';
import type { RefObject } from 'react';
import { Task, TaskStatus } from '../../types/task';
import { TaskItem } from '../TaskItem';
import { getRootTasks, getSubtasks } from '../../utils/taskUtils';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useLanguage } from '../../contexts/LanguageContext';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (task: Task) => void;
  onReactivate: (id: string) => void;
  onEdit?: (task: Task) => void;
  parentModalRef?: RefObject<HTMLDivElement>; // Reference to parent modal
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
  const { t } = useLanguage();

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
      title={t('settings.completedTasks.title')}
      subtitle={`${completedTasks.length} ${completedTasks.length === 1 ? t('settings.completedTasks.task') : t('settings.completedTasks.tasks')}`}
      zIndex={1003}
      offsetRight={500}
      level={2}
      parentModalRef={parentModalRef}
    >
      {rootTasks.length === 0 ? (
        <EmptyState
          title={t('task.noCompletedTasks')}
          description={t('task.noCompletedTasksDescription')}
        />
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
                  onDelete={() => onDelete(task)}
                  onEdit={onEdit}
                  subtasks={subtasks}
                  disableStatusChange={true}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => onReactivate(task.id)}
                    title={t('task.reactivate')}
                  >
                    {t('task.reactivate')}
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
