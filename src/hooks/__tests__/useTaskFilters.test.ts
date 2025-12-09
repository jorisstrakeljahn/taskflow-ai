/**
 * Unit Tests for useTaskFilters Hook
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskFilters } from '../useTaskFilters';
import { Task } from '../../types/task';

// Mock useLanguage hook
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

describe('useTaskFilters', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Work Task',
      status: 'open',
      group: 'Work',
      priority: 'high',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Personal Task',
      status: 'done',
      group: 'Personal',
      priority: 'low',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Work Task 2',
      status: 'in_progress',
      group: 'Work',
      priority: 'medium',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should filter tasks by group', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.setFilterGroup('Work');
    });

    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks.every((t) => t.group === 'Work')).toBe(true);
  });

  it('should filter tasks by status', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.setFilterStatus('open');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].status).toBe('open');
  });

  it('should filter tasks by priority', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.setFilterPriority('high');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].priority).toBe('high');
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.setFilterGroup('Work');
      result.current.setFilterStatus('open');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].group).toBe('Work');
    expect(result.current.filteredTasks[0].status).toBe('open');
  });

  it('should reset all filters', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.setFilterGroup('Work');
      result.current.setFilterStatus('open');
      result.current.setFilterPriority('high');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filterGroup).toBe('all');
    expect(result.current.filterStatus).toBe('all');
    expect(result.current.filterPriority).toBe('all');
    // After reset, should show all non-completed root tasks (2 tasks: 'open' and 'in_progress')
    expect(result.current.filteredTasks.length).toBeGreaterThanOrEqual(2);
  });
});
