import { CustomSelect } from '../ui/CustomSelect';
import { ThemeSelector } from './ThemeSelector';
import { PrimaryColorSelector } from './PrimaryColorSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { PrimaryColor } from '../../contexts/ColorContext';
import { useAccentColor } from '../../hooks/useAccentColor';

interface AppearanceSectionProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  currentLanguage: 'de' | 'en';
  onLanguageChange: (language: 'de' | 'en') => void;
  currentPrimaryColor: PrimaryColor;
  onPrimaryColorChange: (color: PrimaryColor) => void;
}

export const AppearanceSection = ({
  currentTheme,
  onThemeChange,
  currentLanguage,
  onLanguageChange,
  currentPrimaryColor,
  onPrimaryColorChange,
}: AppearanceSectionProps) => {
  const { t } = useLanguage();
  const { accentColor } = useAccentColor();

  return (
    <div className="space-y-6">
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        accentColor={accentColor}
      />
      <PrimaryColorSelector
        currentPrimaryColor={currentPrimaryColor}
        onPrimaryColorChange={onPrimaryColorChange}
        accentColor={accentColor}
      />
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
};
