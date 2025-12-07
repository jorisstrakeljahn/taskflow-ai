import { IconSun, IconMoon, IconMonitor } from '../Icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  accentColor: string;
}

export const ThemeSelector = ({
  currentTheme,
  onThemeChange,
  accentColor,
}: ThemeSelectorProps) => {
  const { t } = useLanguage();

  const ThemeButton = ({
    theme,
    icon: Icon,
    label,
  }: {
    theme: 'light' | 'dark' | 'system';
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) => {
    const isSelected = currentTheme === theme;
    return (
      <button
        type="button"
        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
          isSelected
            ? 'shadow-sm'
            : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        style={isSelected ? {
          borderColor: accentColor,
          backgroundColor: `${accentColor}0d`,
        } : {}}
        onClick={() => onThemeChange(theme)}
        aria-label={label}
      >
        <div
          className={`w-5 h-5 transition-colors ${
            isSelected
              ? ''
              : 'text-text-secondary-light dark:text-text-secondary-dark'
          }`}
          style={isSelected ? { color: accentColor } : {}}
        >
          <Icon />
        </div>
        <span
          className={`text-xs font-medium ${
            isSelected
              ? ''
              : 'text-text-secondary-light dark:text-text-secondary-dark'
          }`}
          style={isSelected ? { color: accentColor } : {}}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
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
        <ThemeButton
          theme="light"
          icon={IconSun}
          label={t('settings.appearance.theme.light')}
        />
        <ThemeButton
          theme="dark"
          icon={IconMoon}
          label={t('settings.appearance.theme.dark')}
        />
        <ThemeButton
          theme="system"
          icon={IconMonitor}
          label={t('settings.appearance.theme.system')}
        />
      </div>
    </div>
  );
};

