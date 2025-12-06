import { useRef, useEffect, useState } from 'react';
import { IconClose, IconChevronRight, IconUser } from './Icons';
import { SettingsDetailModal, SettingsCategory } from './SettingsDetailModal';
import { CompletedTasksModal } from './CompletedTasksModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onLogout?: () => void;
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
  tasks?: any[];
  onStatusChange?: (id: string, status: any) => void;
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  onReactivate?: (id: string) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  onThemeChange,
  onLogout,
  onShowCompletedTasks,
  completedTasksCount = 0,
  tasks = [],
  onStatusChange = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  onReactivate = () => {},
}: SettingsModalProps) => {
  const settingsCategories: Array<{
    id: SettingsCategory;
    title: string;
    description: string;
    icon?: React.ReactNode;
  }> = [
    {
      id: 'account',
      title: 'Account',
      description: 'Email, User ID, Logout',
      icon: <IconUser className="w-5 h-5" />,
    },
    {
      id: 'completed-tasks',
      title: 'Completed Tasks',
      description: `${completedTasksCount} completed ${completedTasksCount === 1 ? 'task' : 'tasks'}`,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme, Colors, Language',
    },
  ];
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategory | null>(null);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentY(null);
      setStartY(null);
      setSelectedCategory(null);
      setIsCompletedTasksOpen(false);
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

  const handleCategoryClick = (category: SettingsCategory) => {
    if (category === 'completed-tasks') {
      // Open completed tasks modal as submodal
      setIsCompletedTasksOpen(true);
    } else {
      // Open detail modal for other categories
      setSelectedCategory(category);
    }
  };

  const handleCompletedTasksClose = () => {
    setIsCompletedTasksOpen(false);
  };

  const handleDetailClose = () => {
    setSelectedCategory(null);
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
        } bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl z-[1001] flex flex-col touch-pan-y transition-all duration-300 ${
          selectedCategory !== null || isCompletedTasksOpen ? 'scale-95 opacity-70 pointer-events-none' : ''
        }`}
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
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-2">
            {settingsCategories.map((category) => {
              const isCompletedTasks = category.id === 'completed-tasks';
              const description = isCompletedTasks
                ? `${completedTasksCount} completed ${completedTasksCount === 1 ? 'task' : 'tasks'}`
                : category.description;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full px-4 py-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    {category.icon && (
                      <div className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors">
                        {category.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                        {category.title}
                      </div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                        {description}
                      </div>
                    </div>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <SettingsDetailModal
        isOpen={selectedCategory !== null}
        category={selectedCategory!}
        onClose={handleDetailClose}
        onLogout={onLogout}
        onShowCompletedTasks={onShowCompletedTasks}
        completedTasksCount={completedTasksCount}
        onThemeChange={onThemeChange}
      />
      <CompletedTasksModal
        isOpen={isCompletedTasksOpen}
        onClose={handleCompletedTasksClose}
        tasks={tasks}
        onStatusChange={onStatusChange}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onReactivate={onReactivate}
      />
    </>
  );
};
