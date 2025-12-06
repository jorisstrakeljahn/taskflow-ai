import { useState, useRef, useEffect } from 'react';
import { TaskPriority } from '../types/task';
import { IconClose } from './Icons';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    group: string;
    priority?: TaskPriority;
  }) => void;
}

const GROUPS = ['General', 'Work', 'Personal', 'Health', 'Finance'];

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('General');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setGroup('General');
      setPriority('');
      setCurrentY(null);
      setStartY(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        group,
        priority: priority || undefined,
      });
      onClose();
    }
  };

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
            ? 'bottom-0 left-0 right-0 rounded-t-3xl h-[90vh]'
            : 'top-1/2 left-1/2 max-w-lg w-full rounded-2xl h-[90vh]'
        } bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl z-[1001] flex flex-col touch-pan-y`}
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
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-title"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare presentation"
              required
              autoFocus
              className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-description"
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={4}
              className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-group"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Group
              </label>
              <select
                id="task-group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
              >
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-priority"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority | '')
                }
                className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-accent-light dark:bg-accent-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
