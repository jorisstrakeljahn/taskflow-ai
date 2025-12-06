import { useTheme } from '../hooks/useTheme';
import { IconCheck } from './Icons';
import { Dashboard } from './Dashboard';
import { ResponsiveModal } from './ResponsiveModal';
import { Button } from './ui/Button';

export type SettingsCategory = 'account' | 'completed-tasks' | 'dashboard' | 'appearance';

interface SettingsDetailModalProps {
  isOpen: boolean;
  category: SettingsCategory;
  onClose: () => void;
  onLogout?: () => void;
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  tasks?: any[];
  parentModalRef?: React.RefObject<HTMLDivElement>; // Reference to parent modal
}

export const SettingsDetailModal = ({
  isOpen,
  category,
  onClose,
  onLogout,
  onShowCompletedTasks,
  completedTasksCount = 0,
  onThemeChange,
  tasks = [],
  parentModalRef,
}: SettingsDetailModalProps) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const getTitle = () => {
    switch (category) {
      case 'account':
        return 'Account';
      case 'completed-tasks':
        return 'Completed Tasks';
      case 'dashboard':
        return 'Dashboard';
      case 'appearance':
        return 'Appearance';
      default:
        return 'Settings';
    }
  };

  const renderContent = () => {
    switch (category) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Email
                </span>
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  user@example.com
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  User ID
                </span>
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  user-1
                </span>
              </div>
            </div>
                 {onLogout && (
                   <Button variant="danger" fullWidth onClick={onLogout}>
                     Logout
                   </Button>
                 )}
          </div>
        );

      case 'completed-tasks':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                View all your completed tasks in one place.
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                You can review, reactivate, or delete completed tasks.
              </p>
            </div>
            {onShowCompletedTasks && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  onShowCompletedTasks();
                  onClose();
                }}
                className="flex items-center justify-between"
              >
                <span>Show Completed Tasks</span>
                {completedTasksCount > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white/20">
                    {completedTasksCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        );

      case 'dashboard':
        return (
          <div>
            <Dashboard tasks={tasks} hideTitle={true} />
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-3">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Theme
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Choose between light, dark, or system design
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-accent-light dark:border-accent-dark bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('light')}
                  aria-label="Light design"
                >
                  <span className="text-2xl">☀️</span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Light
                  </span>
                  {theme === 'light' && (
                    <IconCheck className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                  )}
                </button>
                <button
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-accent-light dark:border-accent-dark bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('dark')}
                  aria-label="Dark design"
                >
                  <span className="text-2xl">🌙</span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Dark
                  </span>
                  {theme === 'dark' && (
                    <IconCheck className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                  )}
                </button>
                <button
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === 'system'
                      ? 'border-accent-light dark:border-accent-dark bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('system')}
                  aria-label="System design"
                >
                  <span className="text-2xl">💻</span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    System
                  </span>
                  {theme === 'system' && (
                    <IconCheck className="w-4 h-4 text-accent-light dark:text-accent-dark" />
                  )}
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-2">
                Primary Color
              </span>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Coming soon: Customize your app's primary color.
              </p>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-2">
                Language
              </span>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Coming soon: Change the app language.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      zIndex={1003}
      offsetRight={500}
      level={2}
      parentModalRef={parentModalRef}
    >
      {renderContent()}
    </ResponsiveModal>
  );
};

