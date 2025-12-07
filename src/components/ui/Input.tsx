import { forwardRef } from 'react';
import { useAccentColor } from '../../hooks/useAccentColor';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const { accentColor } = useAccentColor();

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            error ? 'border-red-500 dark:border-red-500' : ''
          } ${className}`}
          style={{
            '--tw-ring-color': accentColor,
          } as React.CSSProperties & { '--tw-ring-color': string }}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

