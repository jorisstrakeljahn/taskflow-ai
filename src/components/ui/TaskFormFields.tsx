import { TaskPriority, TaskStatus } from '../../types/task';
import { CustomSelect } from '../CustomSelect';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { DEFAULT_GROUPS, TASK_PRIORITIES, TASK_STATUSES } from '../../constants/taskConstants';
import { LABEL_CLASSES } from '../../constants/uiConstants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useColor } from '../../contexts/ColorContext';
import { useTheme } from '../../hooks/useTheme';

interface TaskFormFieldsProps {
  title: string;
  description: string;
  status?: TaskStatus;
  group: string;
  priority: TaskPriority | '';
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange?: (value: TaskStatus) => void;
  onGroupChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority | '') => void;
  existingGroups?: string[];
  showCustomGroup?: boolean;
  customGroup?: string;
  onCustomGroupChange?: (value: string) => void;
  useCustomGroup?: boolean;
  onUseCustomGroupChange?: (checked: boolean) => void;
  showStatus?: boolean;
  titleId?: string;
  descriptionId?: string;
  statusId?: string;
  groupId?: string;
  priorityId?: string;
}

export const TaskFormFields = ({
  title,
  description,
  status = 'open',
  group,
  priority,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onGroupChange,
  onPriorityChange,
  existingGroups = [],
  showCustomGroup = false,
  customGroup = '',
  onCustomGroupChange,
  useCustomGroup = false,
  onUseCustomGroupChange,
  showStatus = false,
  titleId = 'task-title',
  descriptionId = 'task-description',
  statusId = 'task-status',
  groupId = 'task-group',
  priorityId = 'task-priority',
}: TaskFormFieldsProps) => {
  const { t } = useLanguage();
  const { getColorValue } = useColor();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const accentColor = getColorValue(isDark ? 'dark' : 'light');
  // Combine existing groups with default groups
  const allGroups = Array.from(
    new Set([...existingGroups, ...DEFAULT_GROUPS])
  ).sort();

  return (
    <>
      <Input
        id={titleId}
        label={`${t('task.title')} *`}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={t('modals.createTask.titlePlaceholder')}
        required
        autoFocus
      />

      <Textarea
        id={descriptionId}
        label={t('task.description')}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder={t('modals.createTask.descriptionPlaceholder')}
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showStatus && onStatusChange && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor={statusId}
              className={LABEL_CLASSES}
            >
              {t('task.status')}
            </label>
            <CustomSelect
              id={statusId}
              value={status}
              onChange={(value) => onStatusChange(value as TaskStatus)}
              options={TASK_STATUSES.map((s) => {
                const statusKey = s.value === 'in_progress' ? 'inProgress' : s.value;
                return { value: s.value, label: t(`status.${statusKey}`) };
              })}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor={priorityId}
            className={LABEL_CLASSES}
          >
            {t('task.priority')}
          </label>
          <CustomSelect
            id={priorityId}
            value={priority}
            onChange={(value) => onPriorityChange(value as TaskPriority | '')}
            options={TASK_PRIORITIES.map((p) => ({ 
              value: p.value, 
              label: p.value ? t(`priority.${p.value}`) : t('priority.none')
            }))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={groupId}
          className={LABEL_CLASSES}
        >
          {t('task.group')}
        </label>
        <div className="flex flex-col gap-2">
          <CustomSelect
            id={groupId}
            value={useCustomGroup ? '' : group}
            onChange={(value) => {
              onGroupChange(value);
              if (onUseCustomGroupChange) {
                onUseCustomGroupChange(false);
              }
            }}
            disabled={useCustomGroup}
            options={allGroups.map((g) => ({ value: g, label: g }))}
          />
          {showCustomGroup && onUseCustomGroupChange && onCustomGroupChange && (
            <>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={useCustomGroup}
                    onChange={(e) => {
                      onUseCustomGroupChange(e.target.checked);
                      if (e.target.checked) {
                        onCustomGroupChange('');
                      }
                    }}
                    className={`w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer ${
                      useCustomGroup ? 'checked:scale-110' : ''
                    }`}
                    style={useCustomGroup ? {
                      accentColor: accentColor,
                      '--tw-ring-color': accentColor,
                    } as React.CSSProperties & { '--tw-ring-color': string } : {
                      accentColor: 'transparent',
                      '--tw-ring-color': accentColor,
                    } as React.CSSProperties & { '--tw-ring-color': string }}
                  />
                  {useCustomGroup && (
                    <svg
                      className="absolute top-0 left-0 w-5 h-5 pointer-events-none text-white animate-in fade-in zoom-in duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {t('task.createNewGroup')}
                </span>
              </label>
              {useCustomGroup && (
                <Input
                  value={customGroup}
                  onChange={(e) => onCustomGroupChange(e.target.value)}
                  placeholder={t('task.customGroupPlaceholder')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

