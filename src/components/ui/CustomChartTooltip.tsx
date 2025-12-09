/**
 * CustomChartTooltip Component
 *
 * Custom tooltip component for recharts charts with theme-aware styling.
 * Provides consistent tooltip appearance across all charts.
 *
 * @param active - Whether the tooltip is active
 * @param payload - Chart data payload
 *
 * @example
 * ```tsx
 * <Tooltip content={<CustomChartTooltip />} />
 * ```
 */

import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAccentColor } from '../../hooks/useAccentColor';

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; [key: string]: unknown }>;
}

export const CustomChartTooltip = ({ active, payload }: CustomChartTooltipProps) => {
  const { theme } = useTheme();
  const { isDark } = useAccentColor();

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';

  if (active && payload && payload.length) {
    return (
      <div
        className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2 shadow-lg"
        style={{ backgroundColor: cardBg, borderColor }}
      >
        <p className="text-sm font-medium" style={{ color: textColor }}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};
