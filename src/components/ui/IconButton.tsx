import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = ({
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) => {
  const baseStyles = 'rounded-lg border transition-colors flex items-center justify-center';
  
  const variantStyles = {
    default: 'border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'border-transparent bg-transparent text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800',
  };

  const sizeStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

