/**
 * PieChartCard Component
 *
 * Reusable pie chart component for dashboard.
 * Displays a pie chart with custom styling and tooltip.
 */

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '../ui/ChartCard';
import { CustomChartTooltip } from '../ui/CustomChartTooltip';

interface PieChartCardProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  hasData?: boolean;
  noDataMessage?: string;
}

export const PieChartCard = ({
  title,
  data,
  height = 200,
  hasData = true,
  noDataMessage,
}: PieChartCardProps) => {
  const pieOuterRadius = typeof window !== 'undefined' ? Math.min(70, window.innerWidth / 8) : 70;

  return (
    <ChartCard title={title} height={height} hasData={hasData} noDataMessage={noDataMessage}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={pieOuterRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
