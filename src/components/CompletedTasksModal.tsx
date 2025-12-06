import { useRef, useEffect, useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskItem } from './TaskItem';
import { IconClose } from './Icons';
import { getRootTasks, getSubtasks } from '../utils/taskUtils';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

export const CompletedTasksModal = ({
  isOpen,
  onClose,
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
  onReactivate,
}: CompletedTasksModalProps) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentY(null);
      setStartY(null);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      if (e.touches[0].clientY - rect.top < 60) {
        setStartY(e.touches[0].clientY);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null && modalRef.current) {
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        setCurrentY(deltaY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentY !== null && currentY > 100) {
      onClose();
    } else {
      setCurrentY(0);
    }
    setStartY(null);
    setTimeout(() => setCurrentY(null), 300);
  };

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

  const translateY = currentY !== null ? currentY : 0;
  const isMobile = window.innerWidth <= 768;
  const transformStyle = isMobile
    ? `translateY(${translateY}px)`
    : `translate(-50%, calc(-50% + ${translateY}px))`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] animate-in fade-in"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`fixed ${
          isMobile
            ? 'bottom-0 left-0 right-0 rounded-t-3xl'
            : 'top-1/2 left-1/2 max-w-4xl w-full rounded-2xl'
        } bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl z-[1001] flex flex-col max-h-[90vh] md:max-h-[85vh] touch-pan-y`}
        style={{
          transform: transformStyle,
          transition: currentY === null ? 'transform 0.3s ease-out' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 cursor-grab active:cursor-grabbing md:hidden" />
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border-light dark:border-border-dark">
          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              Completed Tasks
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              {completedTasks.length} completed {completedTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
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
        </div>
      </div>
    </>
  );
};

