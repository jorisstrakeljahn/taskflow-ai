import { IconSun, IconMoon, IconMonitor } from './Icons';
import { Dashboard } from './Dashboard';
import { ResponsiveModal } from './ResponsiveModal';
import { Button } from './ui/Button';
import { CustomSelect } from './CustomSelect';
import { useLanguage } from '../contexts/LanguageContext';

export type SettingsCategory = 'account' | 'completed-tasks' | 'dashboard' | 'appearance';

interface SettingsDetailModalProps {
  isOpen: boolean;
  category: SettingsCategory;
  onClose: () => void;
  onLogout?: () => void;
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme: 'light' | 'dark' | 'system';
  onLanguageChange: (language: 'de' | 'en') => void;
  currentLanguage: 'de' | 'en';
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
  currentTheme,
  onLanguageChange,
  currentLanguage,
  tasks = [],
  parentModalRef,
}: SettingsDetailModalProps) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const getTitle = () => {
    switch (category) {
      case 'account':
        return t('settings.account.title');
      case 'completed-tasks':
        return t('settings.completedTasks.title');
      case 'dashboard':
        return t('settings.dashboard.title');
      case 'appearance':
        return t('settings.appearance.title');
      default:
        return t('settings.title');
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
                  {t('settings.account.email')}
                </span>
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  user@example.com
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  {t('settings.account.userId')}
                </span>
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  user-1
                </span>
              </div>
            </div>
                 {onLogout && (
                   <Button variant="danger" fullWidth onClick={onLogout}>
                     {t('settings.account.logout')}
                   </Button>
                 )}
          </div>
        );

      case 'completed-tasks':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                {t('settings.completedTasks.viewDescription')}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.completedTasks.viewDescriptionDetail')}
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
                <span>{t('settings.completedTasks.showCompletedTasks')}</span>
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
                  {t('settings.appearance.theme.title')}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('settings.appearance.theme.description')}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    currentTheme === 'light'
                      ? 'border-accent-light dark:border-accent-dark bg-accent-light/5 dark:bg-accent-dark/5 shadow-sm'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('light')}
                  aria-label={t('settings.appearance.theme.light')}
                >
                  <div
                    className={`w-5 h-5 transition-colors ${
                      currentTheme === 'light'
                        ? 'text-accent-light dark:text-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    <IconSun />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      currentTheme === 'light'
                        ? 'text-accent-light dark:text-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    {t('settings.appearance.theme.light')}
                  </span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    currentTheme === 'dark'
                      ? 'border-accent-light dark:border-accent-dark bg-accent-light/5 dark:bg-accent-dark/5 shadow-sm'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('dark')}
                  aria-label={t('settings.appearance.theme.dark')}
                >
                  <div
                    className={`w-5 h-5 transition-colors ${
                      currentTheme === 'dark'
                        ? 'text-accent-light dark:text-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    <IconMoon />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      currentTheme === 'dark'
                        ? 'text-accent-light dark:text-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    {t('settings.appearance.theme.dark')}
                  </span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    currentTheme === 'system'
                      ? 'border-accent-light dark:border-accent-dark bg-accent-light/5 dark:bg-accent-dark/5 shadow-sm'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => onThemeChange('system')}
                  aria-label={t('settings.appearance.theme.system')}
                >
                  <div
                    className={`w-5 h-5 transition-colors ${
                      currentTheme === 'system'
                        ? 'text-accent-light dark:text-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    <IconMonitor />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      currentTheme === 'system'
                        ? 'text-accent-light dark:text-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  >
                    {t('settings.appearance.theme.system')}
                  </span>
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-2">
                {t('settings.appearance.primaryColor.title')}
              </span>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.appearance.primaryColor.comingSoon')}
              </p>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <div className="mb-3">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  {t('settings.appearance.language.title')}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('settings.appearance.language.description')}
                </span>
              </div>
              <CustomSelect
                id="language-select"
                value={currentLanguage}
                onChange={(value) => onLanguageChange(value as 'de' | 'en')}
                options={[
                  { value: 'en', label: t('settings.appearance.language.english') },
                  { value: 'de', label: t('settings.appearance.language.german') },
                ]}
              />
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

