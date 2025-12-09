/**
 * ProgressBar Component
 *
 * Reusable progress bar component for displaying completion rates and percentages.
 * Supports custom colors and labels.
 *
 * @param value - Current progress value (0-100)
 * @param max - Maximum value (default: 100)
 * @param label - Optional label to display
 * @param showValue - Whether to show the value next to the label
 * @param color - Custom color for the progress bar
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} label="Completion Rate" showValue color="#3B82F6" />
 * ```
 */

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  className?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = false,
  color,
  className = '',
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
              {label}
            </h3>
          )}
          {showValue && (
            <div className="text-xl font-bold" style={{ color: color || 'inherit' }}>
              {Math.round(value)}%
            </div>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color || '#3B82F6',
          }}
        />
      </div>
    </div>
  );
};
