import { Task } from '../types/task';

/**
 * Get task distribution by status
 * Returns data with translated labels
 */
export const getStatusDistribution = (
  tasks: Task[],
  translateStatus: (status: string) => string
) => {
  const open = tasks.filter((t) => t.status === 'open').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;

  return [
    { name: translateStatus('open'), value: open, color: '#6B7280' },
    { name: translateStatus('in_progress'), value: inProgress, color: '#3B82F6' },
    { name: translateStatus('done'), value: done, color: '#10B981' },
  ];
};

/**
 * Get task distribution by priority
 * Returns data with translated labels
 */
export const getPriorityDistribution = (
  tasks: Task[],
  translatePriority: (priority: string) => string
) => {
  const high = tasks.filter((t) => t.priority === 'high').length;
  const medium = tasks.filter((t) => t.priority === 'medium').length;
  const low = tasks.filter((t) => t.priority === 'low').length;
  const none = tasks.filter((t) => !t.priority).length;

  return [
    { name: translatePriority('high'), value: high, color: '#EF4444' },
    { name: translatePriority('medium'), value: medium, color: '#F59E0B' },
    { name: translatePriority('low'), value: low, color: '#3B82F6' },
    { name: translatePriority(''), value: none, color: '#9CA3AF' },
  ];
};

/**
 * Get task completion trend for the last 7 days
 */
export const getCompletionTrend = (tasks: Task[]) => {
  const today = new Date();
  const days = 7;
  const trend = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const completedOnDay = tasks.filter(
      (task) =>
        task.status === 'done' &&
        task.completedAt &&
        task.completedAt >= date &&
        task.completedAt < nextDay
    ).length;

    trend.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: completedOnDay,
    });
  }

  return trend;
};

/**
 * Get task creation trend for the last 7 days
 */
export const getCreationTrend = (tasks: Task[]) => {
  const today = new Date();
  const days = 7;
  const trend = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const createdOnDay = tasks.filter(
      (task) => task.createdAt >= date && task.createdAt < nextDay
    ).length;

    trend.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created: createdOnDay,
    });
  }

  return trend;
};

/**
 * Get tasks by group distribution
 */
export const getGroupDistribution = (tasks: Task[]) => {
  const groupMap = new Map<string, number>();

  tasks.forEach((task) => {
    const count = groupMap.get(task.group) || 0;
    groupMap.set(task.group, count + 1);
  });

  return Array.from(groupMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 groups
};

/**
 * Calculate completion rate
 */
export const getCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'done').length;
  return Math.round((completed / tasks.length) * 100);
};

/**
 * Get tasks due in the next 7 days
 */
export const getUpcomingDueDates = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return tasks.filter(
    (task) =>
      task.dueDate && task.status !== 'done' && task.dueDate >= today && task.dueDate <= nextWeek
  );
};
