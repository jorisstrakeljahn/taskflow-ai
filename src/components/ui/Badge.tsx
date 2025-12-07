interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

/**
 * Reusable Badge component for displaying labels, tags, etc.
 */
export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const baseStyles = 'px-2 py-0.5 text-xs rounded font-medium';

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark',
    primary: 'bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</span>;
};
