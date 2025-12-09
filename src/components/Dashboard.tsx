import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Task } from '../types/task';
import {
  getCompletedTasksToday,
  getCompletedTasksThisWeek,
  getTasksByStatus,
} from '../utils/taskUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { isOverdue } from '../utils/dateUtils';
import { useAccentColor } from '../hooks/useAccentColor';
import {
  getStatusDistribution,
  getPriorityDistribution,
  getCompletionTrend,
  getCreationTrend,
  getCompletionRate,
  getUpcomingDueDates,
} from '../utils/dashboardUtils';
import { formatDate } from '../utils/dateUtils';

interface DashboardProps {
  tasks: Task[];
  hideTitle?: boolean;
}

export const Dashboard = ({ tasks, hideTitle = false }: DashboardProps) => {
  const { t, translateStatus, translatePriority } = useLanguage();
  const { accentColor, isDark } = useAccentColor();

  const stats = useMemo(() => {
    const open = getTasksByStatus(tasks, 'open').length;
    const inProgress = getTasksByStatus(tasks, 'in_progress').length;
    const done = getTasksByStatus(tasks, 'done').length;
    const doneToday = getCompletedTasksToday(tasks).length;
    const doneThisWeek = getCompletedTasksThisWeek(tasks).length;

    return {
      open,
      inProgress,
      done,
      doneToday,
      doneThisWeek,
      total: tasks.length,
    };
  }, [tasks]);

  // Tasks with due dates
  const tasksWithDueDates = useMemo(() => tasks.filter((t) => t.dueDate), [tasks]);
  const overdueTasks = useMemo(
    () => tasksWithDueDates.filter((t) => isOverdue(t.dueDate!) && t.status !== 'done'),
    [tasksWithDueDates]
  );

  // Chart data with translations
  const statusData = useMemo(
    () => getStatusDistribution(tasks, translateStatus),
    [tasks, translateStatus]
  );
  const priorityData = useMemo(
    () => getPriorityDistribution(tasks, translatePriority),
    [tasks, translatePriority]
  );
  const completionTrend = useMemo(() => getCompletionTrend(tasks), [tasks]);
  const creationTrend = useMemo(() => getCreationTrend(tasks), [tasks]);
  const completionRate = useMemo(() => getCompletionRate(tasks), [tasks]);
  const upcomingDueDates = useMemo(() => getUpcomingDueDates(tasks), [tasks]);

  // Chart colors
  const textColor = isDark ? '#E5E7EB' : '#1F2937';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const cardBg = isDark ? '#1F2937' : '#FFFFFF';
  const borderColor = isDark ? '#374151' : '#E5E7EB';

  // Custom tooltip for charts
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
  }) => {
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

  // Chart height based on screen size (smaller for mobile)
  const chartHeight = 200;

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('settings.dashboard.title')}
        </h2>
      )}

      {/* Statistics Cards - Compact Grid with line breaks for long text */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px] w-full">
          <div className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            {stats.open}
          </div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight">
            {t('status.open')}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px] w-full">
          <div className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            {stats.inProgress}
          </div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight">
            <div>{t('status.inProgress').split(' ')[0]}</div>
            {t('status.inProgress').split(' ').length > 1 && (
              <div>{t('status.inProgress').split(' ').slice(1).join(' ')}</div>
            )}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px]">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {stats.doneToday}
          </div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight">
            <div>{t('settings.dashboard.doneToday').split(' ')[0]}</div>
            {t('settings.dashboard.doneToday').split(' ').length > 1 && (
              <div>{t('settings.dashboard.doneToday').split(' ').slice(1).join(' ')}</div>
            )}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px]">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {stats.doneThisWeek}
          </div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight">
            <div>{t('settings.dashboard.doneThisWeek').split(' ')[0]}</div>
            {t('settings.dashboard.doneThisWeek').split(' ').length > 1 && (
              <div>{t('settings.dashboard.doneThisWeek').split(' ').slice(1).join(' ')}</div>
            )}
          </div>
        </div>
        <div
          className="border rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px]"
          style={{
            backgroundColor: `${accentColor}10`,
            borderColor: `${accentColor}30`,
          }}
        >
          <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: accentColor }}>
            {stats.total}
          </div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight">
            {t('settings.dashboard.total')}
          </div>
        </div>
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 text-center flex flex-col justify-center min-h-[80px]">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              {overdueTasks.length}
            </div>
            <div className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300 leading-tight">
              <div>{t('settings.dashboard.overdueTasks').split(' ')[0]}</div>
              {t('settings.dashboard.overdueTasks').split(' ').length > 1 && (
                <div>{t('settings.dashboard.overdueTasks').split(' ').slice(1).join(' ')}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Completion Rate Card - Compact */}
      <div
        className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
        style={{ backgroundColor: cardBg, borderColor }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold" style={{ color: textColor }}>
            {t('settings.dashboard.completionRate')}
          </h3>
          <div className="text-xl font-bold" style={{ color: accentColor }}>
            {completionRate}%
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${completionRate}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* Charts - Vertical Stack */}
      <div className="space-y-4">
        {/* Status Distribution Pie Chart */}
        <div
          className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
          style={{ backgroundColor: cardBg, borderColor }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: textColor }}>
            {t('settings.dashboard.statusDistribution')}
          </h3>
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={
                    typeof window !== 'undefined' ? Math.min(70, window.innerWidth / 8) : 70
                  }
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark"
              style={{ height: chartHeight }}
            >
              {t('settings.dashboard.noData')}
            </div>
          )}
        </div>

        {/* Priority Distribution Pie Chart */}
        <div
          className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
          style={{ backgroundColor: cardBg, borderColor }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: textColor }}>
            {t('settings.dashboard.priorityDistribution')}
          </h3>
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={
                    typeof window !== 'undefined' ? Math.min(70, window.innerWidth / 8) : 70
                  }
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark"
              style={{ height: chartHeight }}
            >
              {t('settings.dashboard.noData')}
            </div>
          )}
        </div>

        {/* Completion Trend Line Chart */}
        <div
          className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
          style={{ backgroundColor: cardBg, borderColor }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: textColor }}>
            {t('settings.dashboard.completionTrend')}
          </h3>
          {completionTrend.some((d) => d.completed > 0) || tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={completionTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  stroke={textColor}
                  style={{ fontSize: '11px' }}
                  tick={{ fill: textColor }}
                />
                <YAxis stroke={textColor} style={{ fontSize: '11px' }} tick={{ fill: textColor }} />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: cardBg,
                    borderColor,
                    color: textColor,
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke={accentColor}
                  strokeWidth={2}
                  dot={{ fill: accentColor, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark"
              style={{ height: chartHeight }}
            >
              {t('settings.dashboard.noData')}
            </div>
          )}
        </div>

        {/* Creation Trend Line Chart */}
        <div
          className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
          style={{ backgroundColor: cardBg, borderColor }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: textColor }}>
            {t('settings.dashboard.creationTrend')}
          </h3>
          {creationTrend.some((d) => d.created > 0) || tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={creationTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  stroke={textColor}
                  style={{ fontSize: '11px' }}
                  tick={{ fill: textColor }}
                />
                <YAxis stroke={textColor} style={{ fontSize: '11px' }} tick={{ fill: textColor }} />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: cardBg,
                    borderColor,
                    color: textColor,
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke={accentColor}
                  strokeWidth={2}
                  dot={{ fill: accentColor, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark"
              style={{ height: chartHeight }}
            >
              {t('settings.dashboard.noData')}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Due Dates - Compact */}
      {upcomingDueDates.length > 0 && (
        <div
          className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
          style={{ backgroundColor: cardBg, borderColor }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: textColor }}>
            {t('settings.dashboard.upcomingDueDates')} ({upcomingDueDates.length})
          </h3>
          <div className="space-y-2">
            {upcomingDueDates.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate pr-2">
                  {task.title}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">
                  {task.dueDate ? formatDate(task.dueDate) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
