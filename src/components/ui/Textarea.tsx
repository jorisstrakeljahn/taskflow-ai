import { forwardRef } from 'react';
import { useAccentColor } from '../../hooks/useAccentColor';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const { accentColor } = useAccentColor();

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            error ? 'border-red-500 dark:border-red-500' : ''
          } ${className}`}
          style={
            {
              '--tw-ring-color': accentColor,
            } as React.CSSProperties & { '--tw-ring-color': string }
          }
          {...props}
        />
        {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
