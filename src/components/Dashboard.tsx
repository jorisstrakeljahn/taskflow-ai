import { useMemo } from 'react';
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
import { StatCard } from './ui/StatCard';
import { ProgressBar } from './ui/ProgressBar';
import { PieChartCard } from './dashboard/PieChartCard';
import { LineChartCard } from './dashboard/LineChartCard';
import { useTheme } from '../hooks/useTheme';

interface DashboardProps {
  tasks: Task[];
  hideTitle?: boolean;
}

export const Dashboard = ({ tasks, hideTitle = false }: DashboardProps) => {
  const { t, translateStatus, translatePriority } = useLanguage();
  const { accentColor } = useAccentColor();
  const { theme } = useTheme();

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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

  // Chart colors for upcoming due dates card
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';

  const chartHeight = 200;

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('settings.dashboard.title')}
        </h2>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard value={stats.open} label={t('status.open')} variant="default" />
        <StatCard
          value={stats.inProgress}
          label={t('status.inProgress')}
          variant="default"
          splitLabel
        />
        <StatCard
          value={stats.doneToday}
          label={t('settings.dashboard.doneToday')}
          variant="success"
          splitLabel
        />
        <StatCard
          value={stats.doneThisWeek}
          label={t('settings.dashboard.doneThisWeek')}
          variant="success"
          splitLabel
        />
        <StatCard
          value={stats.total}
          label={t('settings.dashboard.total')}
          variant="accent"
          accentColor={accentColor}
        />
        {overdueTasks.length > 0 && (
          <StatCard
            value={overdueTasks.length}
            label={t('settings.dashboard.overdueTasks')}
            variant="danger"
            splitLabel
          />
        )}
      </div>

      {/* Completion Rate */}
      <div
        className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4"
        style={{ backgroundColor: cardBg, borderColor }}
      >
        <ProgressBar
          value={completionRate}
          label={t('settings.dashboard.completionRate')}
          showValue
          color={accentColor}
        />
      </div>

      {/* Charts */}
      <div className="space-y-4">
        <PieChartCard
          title={t('settings.dashboard.statusDistribution')}
          data={statusData}
          height={chartHeight}
          hasData={tasks.length > 0}
          noDataMessage={t('settings.dashboard.noData')}
        />
        <PieChartCard
          title={t('settings.dashboard.priorityDistribution')}
          data={priorityData}
          height={chartHeight}
          hasData={tasks.length > 0}
          noDataMessage={t('settings.dashboard.noData')}
        />
        <LineChartCard
          title={t('settings.dashboard.completionTrend')}
          data={completionTrend}
          dataKey="completed"
          height={chartHeight}
          hasData={completionTrend.some((d) => d.completed > 0) || tasks.length > 0}
          noDataMessage={t('settings.dashboard.noData')}
        />
        <LineChartCard
          title={t('settings.dashboard.creationTrend')}
          data={creationTrend}
          dataKey="created"
          height={chartHeight}
          hasData={creationTrend.some((d) => d.created > 0) || tasks.length > 0}
          noDataMessage={t('settings.dashboard.noData')}
        />
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
