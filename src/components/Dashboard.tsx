import { useMemo } from 'react';
import { Task } from '../types/task';
import {
  getCompletedTasksToday,
  getCompletedTasksThisWeek,
  getTasksByStatus,
} from '../utils/taskUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { isOverdue } from '../utils/dateUtils';

interface DashboardProps {
  tasks: Task[];
  hideTitle?: boolean;
}

export const Dashboard = ({ tasks, hideTitle = false }: DashboardProps) => {
  const { t } = useLanguage();
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

  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
      {!hideTitle && (
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-5">
          {t('settings.dashboard.title')}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            {stats.open}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            {t('status.open')}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            {stats.inProgress}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            {t('status.inProgress')}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {stats.doneToday}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            {t('dashboard.doneToday')}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {stats.doneThisWeek}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            {t('dashboard.doneThisWeek')}
          </div>
        </div>
        <div className="bg-accent-light/10 dark:bg-accent-dark/10 border border-accent-light/30 dark:border-accent-dark/30 rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-accent-light dark:text-accent-dark mb-2">
            {stats.total}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            {t('dashboard.total')}
          </div>
        </div>
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-5 text-center transition-all hover:shadow-sm">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {overdueTasks.length}
            </div>
            <div className="text-sm font-medium text-red-700 dark:text-red-300">
              {t('dashboard.overdueTasks') || 'Overdue Tasks'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
