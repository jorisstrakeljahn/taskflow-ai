import { IconSun, IconMoon, IconMonitor, IconCheck } from './Icons';
import { Dashboard } from './Dashboard';
import { ResponsiveModal } from './ResponsiveModal';
import { Button } from './ui/Button';
import { CustomSelect } from './CustomSelect';
import { useLanguage } from '../contexts/LanguageContext';
import { useColor, PrimaryColor } from '../contexts/ColorContext';
import { useTheme } from '../hooks/useTheme';

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
  const { colorPalettes, getTextColor, getColorValue } = useColor();
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
                      ? 'shadow-sm'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={currentTheme === 'light' ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}0d`,
                  } : {}}
                  onClick={() => onThemeChange('light')}
                  aria-label={t('settings.appearance.theme.light')}
                >
                  <div
                    className={`w-5 h-5 transition-colors ${
                      currentTheme === 'light'
                        ? ''
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    style={currentTheme === 'light' ? { color: accentColor } : {}}
                  >
                    <IconSun />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      currentTheme === 'light'
                        ? ''
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    style={currentTheme === 'light' ? { color: accentColor } : {}}
                  >
                    {t('settings.appearance.theme.light')}
                  </span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    currentTheme === 'dark'
                      ? 'shadow-sm'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={currentTheme === 'dark' ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}0d`,
                  } : {}}
                  onClick={() => onThemeChange('dark')}
                  aria-label={t('settings.appearance.theme.dark')}
                >
                  <div
                    className={`w-5 h-5 transition-colors ${
                      currentTheme === 'dark'
                        ? ''
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    style={currentTheme === 'dark' ? { color: accentColor } : {}}
                  >
                    <IconMoon />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      currentTheme === 'dark'
                        ? ''
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    style={currentTheme === 'dark' ? { color: accentColor } : {}}
                  >
                    {t('settings.appearance.theme.dark')}
                  </span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    currentTheme === 'system'
                      ? 'shadow-sm'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={currentTheme === 'system' ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}0d`,
                  } : {}}
                  onClick={() => onThemeChange('system')}
                  aria-label={t('settings.appearance.theme.system')}
                >
                  <div
                    className={`w-5 h-5 transition-colors ${
                      currentTheme === 'system'
                        ? ''
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    style={currentTheme === 'system' ? { color: accentColor } : {}}
                  >
                    <IconMonitor />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      currentTheme === 'system'
                        ? ''
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    style={currentTheme === 'system' ? { color: accentColor } : {}}
                  >
                    {t('settings.appearance.theme.system')}
                  </span>
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-border-light dark:border-border-dark">
              <div className="mb-3">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  {t('settings.appearance.primaryColor.title')}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('settings.appearance.primaryColor.description')}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {(Object.keys(colorPalettes) as PrimaryColor[]).map((colorKey) => {
                  const color = colorPalettes[colorKey];
                  const isSelected = currentPrimaryColor === colorKey;
                  const lightColor = color.light;
                  const darkColor = color.dark;
                  // Use the lighter color to determine text color for the checkmark
                  const textColor = getTextColor(lightColor);
                  
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => onPrimaryColorChange(colorKey)}
                      className={`relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-offset-card-light dark:ring-offset-card-dark'
                          : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${lightColor} 0%, ${darkColor} 100%)`,
                        ...(isSelected ? {
                          borderColor: accentColor,
                          '--tw-ring-color': accentColor,
                          '--tw-ring-opacity': '1',
                        } as React.CSSProperties & { '--tw-ring-color': string } : {}),
                      }}
                      aria-label={color.name}
                      title={color.name}
                    >
                      {isSelected && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${
                            textColor === 'white' ? 'text-white drop-shadow-lg' : 'text-black drop-shadow-lg'
                          }`}
                        >
                          <IconCheck className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
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

