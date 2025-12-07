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
      // Only show completed tasks
      filtered = getTasksByStatus(filtered, 'done');
    } else if (filterStatus !== 'all') {
      // Filter by specific status and exclude completed tasks
      filtered = getTasksByStatus(filtered, filterStatus as Task['status']);
    } else {
      // Show all except completed tasks when "all" is selected
      filtered = filtered.filter((t) => t.status !== 'done');
    }

    // Filter by group
    if (filterGroup !== 'all') {
      filtered = getTasksByGroup(filtered, filterGroup);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority);
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

