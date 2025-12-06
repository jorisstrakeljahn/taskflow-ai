import { useMemo } from 'react';
import { Task } from '../types/task';
import {
  getCompletedTasksToday,
  getCompletedTasksThisWeek,
  getTasksByStatus,
} from '../utils/taskUtils';

interface DashboardProps {
  tasks: Task[];
  hideTitle?: boolean;
}

export const Dashboard = ({ tasks, hideTitle = false }: DashboardProps) => {
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

  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
      {!hideTitle && (
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-5">
          Dashboard
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            {stats.open}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            Open
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            {stats.inProgress}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            In Progress
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {stats.doneToday}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            Done Today
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {stats.doneThisWeek}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            This Week
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5 text-center transition-all hover:shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {stats.total}
          </div>
          <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            Total
          </div>
        </div>
      </div>
    </div>
  );
};
