import { useState } from 'react';
import { IconChevronRight, IconUser, IconBarChart } from './Icons';
import { SettingsDetailModal, SettingsCategory } from './SettingsDetailModal';
import { CompletedTasksModal } from './CompletedTasksModal';
import { ResponsiveModal } from './ResponsiveModal';

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
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Statistics and overview',
      icon: <IconBarChart className="w-5 h-5" />,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme, Colors, Language',
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategory | null>(null);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(false);

  const hasSubModalOpen = selectedCategory !== null || isCompletedTasksOpen;

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

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        title="Settings"
        zIndex={hasSubModalOpen ? 1001 : 1001}
        offsetRight={hasSubModalOpen ? 500 : 0}
      >
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
      </ResponsiveModal>
      <SettingsDetailModal
        isOpen={selectedCategory !== null}
        category={selectedCategory!}
        onClose={handleDetailClose}
        onLogout={onLogout}
        onShowCompletedTasks={onShowCompletedTasks}
        completedTasksCount={completedTasksCount}
        onThemeChange={onThemeChange}
        tasks={tasks}
        parentOffset={500}
      />
      <CompletedTasksModal
        isOpen={isCompletedTasksOpen}
        onClose={handleCompletedTasksClose}
        tasks={tasks}
        onStatusChange={onStatusChange}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onReactivate={onReactivate}
        parentOffset={500}
      />
    </>
  );
};
