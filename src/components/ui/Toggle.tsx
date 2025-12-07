import { ReactNode } from 'react';
import { useAccentColor } from '../../hooks/useAccentColor';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  alignRight?: boolean;
}

export const Toggle = ({
  checked,
  onChange,
  label,
  icon,
  disabled = false,
  alignRight = false,
}: ToggleProps) => {
  const { accentColor } = useAccentColor();

  return (
    <div className={`flex items-center gap-3 ${alignRight ? 'justify-end' : ''}`}>
      {icon && !label && (
        <span
          className="text-text-secondary-light dark:text-text-secondary-dark cursor-pointer"
          onClick={() => !disabled && onChange(!checked)}
        >
          {icon}
        </span>
      )}
      {label && (
        <label
          className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer flex items-center gap-2"
          onClick={() => !disabled && onChange(!checked)}
        >
          {icon && (
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              {icon}
            </span>
          )}
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        } ${
          checked
            ? ''
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
        style={{
          backgroundColor: checked ? accentColor : undefined,
          '--tw-ring-color': accentColor,
        } as React.CSSProperties & { '--tw-ring-color': string }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

