import { useState, memo, useMemo } from 'react';
import {
  IconFilter,
  IconFolder,
  IconLayers,
  IconZap,
  IconChevronDown,
  IconGripVertical,
} from './Icons';
import { FilterField } from './filters/FilterField';
import { Toggle } from './ui/Toggle';
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants/taskConstants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccentColor } from '../hooks/useAccentColor';

interface TaskFiltersProps {
  filterGroup: string;
  filterStatus: string;
  filterPriority: string;
  groups: string[];
  onGroupChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onReset: () => void;
  isDragMode?: boolean;
  onDragModeToggle?: (enabled: boolean) => void;
}

const TaskFiltersComponent = ({
  filterGroup,
  filterStatus,
  filterPriority,
  groups,
  onGroupChange,
  onStatusChange,
  onPriorityChange,
  onReset,
  isDragMode = false,
  onDragModeToggle,
}: TaskFiltersProps) => {
  const { t } = useLanguage();
  const { accentColor } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = useMemo(
    () => filterGroup !== 'all' || filterStatus !== 'all' || filterPriority !== 'all',
    [filterGroup, filterStatus, filterPriority]
  );

  const groupOptions = useMemo(
    () => [
      { value: 'all', label: t('filters.allGroups') },
      ...groups.map((group) => ({ value: group, label: group })),
    ],
    [groups, t]
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('status.all') },
      ...TASK_STATUSES.map((s) => {
        const statusKey = s.value === 'in_progress' ? 'inProgress' : s.value;
        return { value: s.value, label: t(`status.${statusKey}`) };
      }),
    ],
    [t]
  );

  const priorityOptions = useMemo(
    () => [
      { value: 'all', label: t('priority.all') },
      ...TASK_PRIORITIES.filter((p) => p.value !== '').map((p) => ({
        value: p.value,
        label: t(`priority.${p.value}`),
      })),
    ],
    [t]
  );

  return (
    <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('filters.title')}
        aria-expanded={isOpen}
        aria-controls="filter-content"
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
          hasActiveFilters
            ? 'bg-accent-light/10 dark:bg-accent-dark/10'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <IconFilter className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
            {t('filters.title')}
          </span>
          {hasActiveFilters && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-full text-white"
              style={{ backgroundColor: accentColor }}
            >
              {t('common.active')}
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
              aria-label={t('filters.reset')}
              className="px-2 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
            >
              {t('filters.reset')}
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
        <div
          id="filter-content"
          role="region"
          aria-label={t('filters.title')}
          className="px-4 py-3 space-y-3 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark"
        >
          {onDragModeToggle && (
            <div className="pb-2 border-b border-border-light dark:border-border-dark">
              <Toggle
                checked={isDragMode}
                onChange={onDragModeToggle}
                icon={<IconGripVertical className="w-4 h-4" size={16} />}
                alignRight={true}
              />
            </div>
          )}
          <FilterField
            id="filter-group"
            label={t('filters.group')}
            icon={<IconFolder className="w-4 h-4" />}
            value={filterGroup}
            onChange={onGroupChange}
            options={groupOptions}
          />
          <FilterField
            id="filter-status"
            label={t('filters.status')}
            icon={<IconLayers className="w-4 h-4" />}
            value={filterStatus}
            onChange={onStatusChange}
            options={statusOptions}
          />
          <FilterField
            id="filter-priority"
            label={t('filters.priority')}
            icon={<IconZap className="w-4 h-4" />}
            value={filterPriority}
            onChange={onPriorityChange}
            options={priorityOptions}
          />
        </div>
      )}
    </div>
  );
};

export const TaskFilters = memo(TaskFiltersComponent);
