import { useState } from 'react';
import { TaskPriority, TaskStatus } from '../types/task';
import { CustomSelect } from './CustomSelect';
import { IconFilter, IconFolder, IconLayers, IconZap, IconChevronDown } from './Icons';
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants/taskConstants';

interface TaskFiltersProps {
  filterGroup: string;
  filterStatus: string;
  filterPriority: string;
  groups: string[];
  onGroupChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onReset: () => void;
}

export const TaskFilters = ({
  filterGroup,
  filterStatus,
  filterPriority,
  groups,
  onGroupChange,
  onStatusChange,
  onPriorityChange,
  onReset,
}: TaskFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasActiveFilters = 
    filterGroup !== 'all' || 
    filterStatus !== 'all' || 
    filterPriority !== 'all';

  return (
    <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
          hasActiveFilters
            ? 'bg-accent-light/10 dark:bg-accent-dark/10'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <IconFilter className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent-light dark:bg-accent-dark text-white">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="px-2 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
            >
              Reset
            </button>
          )}
          <IconChevronDown
            className={`w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-4 space-y-4 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark">
          {/* Group Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <IconFolder className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
              <label
                htmlFor="filter-group"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Group
              </label>
            </div>
            <CustomSelect
              id="filter-group"
              value={filterGroup}
              onChange={onGroupChange}
              options={[
                { value: 'all', label: 'All Groups' },
                ...groups.map((group) => ({ value: group, label: group })),
              ]}
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <IconLayers className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
              <label
                htmlFor="filter-status"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Status
              </label>
            </div>
            <CustomSelect
              id="filter-status"
              value={filterStatus}
              onChange={onStatusChange}
              options={[
                { value: 'all', label: 'All Statuses' },
                ...TASK_STATUSES.map((s) => ({ value: s.value, label: s.label })),
              ]}
            />
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <IconZap className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
              <label
                htmlFor="filter-priority"
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Priority
              </label>
            </div>
            <CustomSelect
              id="filter-priority"
              value={filterPriority}
              onChange={onPriorityChange}
              options={[
                { value: 'all', label: 'All Priorities' },
                ...TASK_PRIORITIES.filter((p) => p.value !== '').map((p) => ({
                  value: p.value,
                  label: p.label,
                })),
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

