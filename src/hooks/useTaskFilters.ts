import { useMemo, useState } from 'react';
import { Task } from '../types/task';
import { getTasksByGroup, getTasksByStatus } from '../utils/taskUtils';

interface UseTaskFiltersReturn {
  filterGroup: string;
  filterStatus: string;
  filterPriority: string;
  setFilterGroup: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setFilterPriority: (value: string) => void;
  filteredTasks: Task[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

/**
 * Custom hook to manage task filtering logic
 */
export const useTaskFilters = (tasks: Task[]): UseTaskFiltersReturn => {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (filterStatus === 'done') {
      // Only show completed root tasks (not subtasks)
      filtered = getTasksByStatus(filtered, 'done').filter((t) => !t.parentId);
    } else if (filterStatus !== 'all') {
      // Filter by specific status and exclude completed root tasks (but keep all subtasks)
      const rootTasks = filtered.filter((t) => !t.parentId);
      const subtasks = filtered.filter((t) => t.parentId);
      
      const filteredRootTasks = getTasksByStatus(rootTasks, filterStatus as Task['status']);
      // Always include all subtasks, regardless of their status
      filtered = [...filteredRootTasks, ...subtasks];
    } else {
      // Show all root tasks except completed ones, but always show all subtasks
      const rootTasks = filtered.filter((t) => !t.parentId);
      const subtasks = filtered.filter((t) => t.parentId);
      
      const filteredRootTasks = rootTasks.filter((t) => t.status !== 'done');
      // Always include all subtasks, regardless of their status
      filtered = [...filteredRootTasks, ...subtasks];
    }

    // Filter by group (only affects root tasks, subtasks are always shown)
    if (filterGroup !== 'all') {
      const rootTasks = filtered.filter((t) => !t.parentId);
      const subtasks = filtered.filter((t) => t.parentId);
      
      const filteredRootTasks = getTasksByGroup(rootTasks, filterGroup);
      // Always include all subtasks
      filtered = [...filteredRootTasks, ...subtasks];
    }

    // Filter by priority (only affects root tasks, subtasks are always shown)
    if (filterPriority !== 'all') {
      const rootTasks = filtered.filter((t) => !t.parentId);
      const subtasks = filtered.filter((t) => t.parentId);
      
      const filteredRootTasks = rootTasks.filter((t) => t.priority === filterPriority);
      // Always include all subtasks
      filtered = [...filteredRootTasks, ...subtasks];
    }

    return filtered;
  }, [tasks, filterGroup, filterStatus, filterPriority]);

  const hasActiveFilters = 
    filterGroup !== 'all' || 
    filterStatus !== 'all' || 
    filterPriority !== 'all';

  const resetFilters = () => {
    setFilterGroup('all');
    setFilterStatus('all');
    setFilterPriority('all');
  };

  return {
    filterGroup,
    filterStatus,
    filterPriority,
    setFilterGroup,
    setFilterStatus,
    setFilterPriority,
    filteredTasks,
    hasActiveFilters,
    resetFilters,
  };
};

