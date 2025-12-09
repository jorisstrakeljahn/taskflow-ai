/**
 * LineChartCard Component
 *
 * Reusable line chart component for dashboard.
 * Displays a line chart with custom styling and tooltip.
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from '../ui/ChartCard';
import { CustomChartTooltip } from '../ui/CustomChartTooltip';
import { useAccentColor } from '../../hooks/useAccentColor';
import { useTheme } from '../../hooks/useTheme';

interface LineChartCardProps {
  title: string;
  data: Array<{ date: string; [key: string]: string | number }>;
  dataKey: string;
  height?: number;
  hasData?: boolean;
  noDataMessage?: string;
}

export const LineChartCard = ({
  title,
  data,
  dataKey,
  height = 200,
  hasData = true,
  noDataMessage,
}: LineChartCardProps) => {
  const { accentColor } = useAccentColor();
  const { theme } = useTheme();

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <ChartCard title={title} height={height} hasData={hasData} noDataMessage={noDataMessage}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            stroke={textColor}
            style={{ fontSize: '11px' }}
            tick={{ fill: textColor }}
          />
          <YAxis stroke={textColor} style={{ fontSize: '11px' }} tick={{ fill: textColor }} />
          <Tooltip
            content={<CustomChartTooltip />}
            contentStyle={{
              backgroundColor: cardBg,
              borderColor,
              color: textColor,
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={accentColor}
            strokeWidth={2}
            dot={{ fill: accentColor, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
