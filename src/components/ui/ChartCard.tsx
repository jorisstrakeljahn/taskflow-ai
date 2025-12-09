/**
 * ChartCard Component
 *
 * Reusable wrapper component for charts with consistent styling, title, and empty state handling.
 * Provides a consistent card layout for all dashboard charts.
 *
 * @param title - Chart title
 * @param children - Chart component (e.g., PieChart, LineChart)
 * @param height - Chart height in pixels (default: 200)
 * @param noDataMessage - Message to display when there's no data
 * @param hasData - Whether data is available
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <ChartCard title="Status Distribution" hasData={tasks.length > 0}>
 *   <PieChart>...</PieChart>
 * </ChartCard>
 * ```
 */

import React from 'react';
import { useAccentColor } from '../../hooks/useAccentColor';
import { useTheme } from '../../hooks/useTheme';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  height?: number;
  noDataMessage?: string;
  hasData?: boolean;
  className?: string;
}

export const ChartCard = ({
  title,
  children,
  height = 200,
  noDataMessage = 'No data available',
  hasData = true,
  className = '',
}: ChartCardProps) => {
  const { theme } = useTheme();

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <div
      className={`bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4 ${className}`}
      style={{ backgroundColor: cardBg, borderColor }}
    >
      <h3 className="text-base font-semibold mb-3" style={{ color: textColor }}>
        {title}
      </h3>
      {hasData ? (
        children
      ) : (
        <div
          className="flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark"
          style={{ height }}
        >
          {noDataMessage}
        </div>
      )}
    </div>
  );
};
