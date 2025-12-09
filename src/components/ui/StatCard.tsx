/**
 * StatCard Component
 *
 * Reusable statistic card component for displaying metrics with value and label.
 * Supports different variants (default, success, warning, danger) and custom styling.
 *
 * @param value - The numeric value to display
 * @param label - The label text (can be split into multiple lines)
 * @param variant - Visual variant (default, success, warning, danger, accent)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <StatCard value={42} label="Open Tasks" variant="default" />
 * <StatCard value={10} label="Done Today" variant="success" />
 * ```
 */

import React from 'react';

interface StatCardProps {
  value: number | string;
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  className?: string;
  accentColor?: string;
  splitLabel?: boolean; // Whether to split label into multiple lines
}

export const StatCard = ({
  value,
  label,
  variant = 'default',
  className = '',
  accentColor,
  splitLabel = false,
}: StatCardProps) => {
  // Determine background and text colors based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-600 dark:text-green-400',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-600 dark:text-orange-400',
        };
      case 'danger':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-600 dark:text-red-400',
        };
      case 'accent':
        return {
          bg: '',
          border: '',
          text: '',
          customBg: accentColor ? `${accentColor}10` : undefined,
          customBorder: accentColor ? `${accentColor}30` : undefined,
          customText: accentColor,
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-border-light dark:border-border-dark',
          text: 'text-text-primary-light dark:text-text-primary-dark',
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Split label into words for line breaks if needed
  const labelParts = splitLabel ? label.split(' ') : [label];

  return (
    <div
      className={`${variantStyles.bg || ''} ${variantStyles.border || ''} border rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px] w-full ${className}`}
      style={{
        backgroundColor: variantStyles.customBg,
        borderColor: variantStyles.customBorder,
      }}
    >
      <div
        className={`text-2xl sm:text-3xl font-bold mb-1 ${variantStyles.text || ''}`}
        style={variantStyles.customText ? { color: variantStyles.customText } : undefined}
      >
        {value}
      </div>
      <div className="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight">
        {splitLabel && labelParts.length > 1 ? (
          <>
            <div>{labelParts[0]}</div>
            <div>{labelParts.slice(1).join(' ')}</div>
          </>
        ) : (
          <div>{label}</div>
        )}
      </div>
    </div>
  );
};
