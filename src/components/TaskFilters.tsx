import { useState } from 'react';
import { IconFilter, IconFolder, IconLayers, IconZap, IconChevronDown } from './Icons';
import { FilterField } from './filters/FilterField';
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants/taskConstants';
import { useLanguage } from '../contexts/LanguageContext';
import { useColor } from '../contexts/ColorContext';
import { useTheme } from '../hooks/useTheme';

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
  const { t } = useLanguage();
  const { getColorValue } = useColor();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const accentColor = getColorValue(isDark ? 'dark' : 'light');
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
        <div className="px-4 py-4 space-y-4 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark">
          <FilterField
            id="filter-group"
            label={t('filters.group')}
            icon={<IconFolder className="w-4 h-4" />}
            value={filterGroup}
            onChange={onGroupChange}
            options={[
              { value: 'all', label: t('filters.allGroups') },
              ...groups.map((group) => ({ value: group, label: group })),
            ]}
          />
          <FilterField
            id="filter-status"
            label={t('filters.status')}
            icon={<IconLayers className="w-4 h-4" />}
            value={filterStatus}
            onChange={onStatusChange}
            options={[
              { value: 'all', label: t('status.all') },
              ...TASK_STATUSES.map((s) => ({ value: s.value, label: t(`status.${s.value}`) })),
            ]}
          />
          <FilterField
            id="filter-priority"
            label={t('filters.priority')}
            icon={<IconZap className="w-4 h-4" />}
            value={filterPriority}
            onChange={onPriorityChange}
            options={[
              { value: 'all', label: t('priority.all') },
              ...TASK_PRIORITIES.filter((p) => p.value !== '').map((p) => ({
                value: p.value,
                label: t(`priority.${p.value}`),
              })),
            ]}
          />
        </div>
      )}
    </div>
  );
};

