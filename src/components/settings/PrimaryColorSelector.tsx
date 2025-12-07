import { IconCheck } from '../Icons';
import { useColor, PrimaryColor } from '../../contexts/ColorContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface PrimaryColorSelectorProps {
  currentPrimaryColor: PrimaryColor;
  onPrimaryColorChange: (color: PrimaryColor) => void;
  accentColor: string;
}

export const PrimaryColorSelector = ({
  currentPrimaryColor,
  onPrimaryColorChange,
  accentColor,
}: PrimaryColorSelectorProps) => {
  const { t } = useLanguage();
  const { colorPalettes, getTextColor } = useColor();

  return (
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
  );
};

