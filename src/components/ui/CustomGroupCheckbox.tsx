import { useLanguage } from '../../contexts/LanguageContext';
import { useAccentColor } from '../../hooks/useAccentColor';

interface CustomGroupCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onCustomGroupChange: (value: string) => void;
}

export const CustomGroupCheckbox = ({
  checked,
  onChange,
  onCustomGroupChange,
}: CustomGroupCheckboxProps) => {
  const { t } = useLanguage();
  const { accentColor } = useAccentColor();

  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
            if (e.target.checked) {
              onCustomGroupChange('');
            }
          }}
          className={`w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer ${
            checked ? 'checked:scale-110' : ''
          }`}
          style={checked ? {
            accentColor: accentColor,
            '--tw-ring-color': accentColor,
          } as React.CSSProperties & { '--tw-ring-color': string } : {
            accentColor: 'transparent',
            '--tw-ring-color': accentColor,
          } as React.CSSProperties & { '--tw-ring-color': string }}
        />
        {checked && (
          <svg
            className="absolute top-0 left-0 w-5 h-5 pointer-events-none text-white animate-in fade-in zoom-in duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
        {t('task.createNewGroup')}
      </span>
    </label>
  );
};

