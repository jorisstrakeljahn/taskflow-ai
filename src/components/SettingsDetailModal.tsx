import { Dashboard } from './Dashboard';
import { ResponsiveModal } from './ResponsiveModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useColor, PrimaryColor } from '../contexts/ColorContext';
import { useTheme } from '../hooks/useTheme';
import {
  AccountSection,
  CompletedTasksSection,
  AppearanceSection,
} from './settings';

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
  onPrimaryColorChange: (color: PrimaryColor) => void;
  currentPrimaryColor: PrimaryColor;
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
  onPrimaryColorChange,
  currentPrimaryColor,
  tasks = [],
  parentModalRef,
}: SettingsDetailModalProps) => {
  const { t } = useLanguage();
  const { getColorValue } = useColor();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const accentColor = getColorValue(isDark ? 'dark' : 'light');

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
        return <AccountSection onLogout={onLogout} />;

      case 'completed-tasks':
        return (
          <CompletedTasksSection
            onShowCompletedTasks={onShowCompletedTasks}
            completedTasksCount={completedTasksCount}
            onClose={onClose}
          />
        );

      case 'dashboard':
        return (
          <div>
            <Dashboard tasks={tasks} hideTitle={true} />
          </div>
        );

      case 'appearance':
        return (
          <AppearanceSection
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            currentPrimaryColor={currentPrimaryColor}
            onPrimaryColorChange={onPrimaryColorChange}
            accentColor={accentColor}
          />
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

