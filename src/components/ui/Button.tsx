import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useAccentColor } from '../../hooks/useAccentColor';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const { accentColor } = useAccentColor();

  const baseStyles =
    'px-4 py-3 rounded-lg font-medium transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'text-white hover:opacity-90',
    secondary:
      'bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700',
    danger:
      'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30',
  };

  const primaryStyle = variant === 'primary' ? { backgroundColor: accentColor } : {};

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={primaryStyle}
      {...props}
    >
      {children}
    </button>
  );
};
