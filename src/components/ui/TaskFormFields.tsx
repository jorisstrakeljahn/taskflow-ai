import { TaskPriority, TaskStatus } from '../../types/task';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { CustomGroupCheckbox } from './CustomGroupCheckbox';
import { FormSelectField } from './FormSelectField';
import { DEFAULT_GROUPS, TASK_PRIORITIES, TASK_STATUSES } from '../../constants/taskConstants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccentColor } from '../../hooks/useAccentColor';

interface TaskFormFieldsProps {
  title: string;
  description: string;
  group: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  existingGroups?: string[];
  showCustomGroup?: boolean;
  customGroup?: string;
  onCustomGroupChange?: (value: string) => void;
  useCustomGroup?: boolean;
  onUseCustomGroupChange?: (checked: boolean) => void;
  // Optional fields for CreateTaskModal (not used in EditTaskModal)
  status?: TaskStatus;
  priority?: TaskPriority | '';
  onStatusChange?: (value: TaskStatus) => void;
  onPriorityChange?: (value: TaskPriority | '') => void;
  showStatus?: boolean;
  // Due date field
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  onDueDateChange?: (value: string) => void;
  titleId?: string;
  descriptionId?: string;
  groupId?: string;
  statusId?: string;
  priorityId?: string;
  dueDateId?: string;
}

export const TaskFormFields = ({
  title,
  description,
  group,
  onTitleChange,
  onDescriptionChange,
  onGroupChange,
  existingGroups = [],
  showCustomGroup = false,
  customGroup = '',
  onCustomGroupChange,
  useCustomGroup = false,
  onUseCustomGroupChange,
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  showStatus = false,
  dueDate,
  onDueDateChange,
  titleId = 'task-title',
  descriptionId = 'task-description',
  groupId = 'task-group',
  statusId = 'task-status',
  priorityId = 'task-priority',
  dueDateId = 'task-due-date',
}: TaskFormFieldsProps) => {
  const { t } = useLanguage();
  const { accentColor } = useAccentColor();
  // Combine existing groups with default groups
  const allGroups = Array.from(new Set([...existingGroups, ...DEFAULT_GROUPS])).sort();

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

      {/* Status and Priority - only shown in CreateTaskModal */}
      {(showStatus || priority !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showStatus && onStatusChange && status !== undefined && (
            <FormSelectField
              id={statusId}
              label={t('task.status')}
              value={status}
              onChange={(value) => onStatusChange(value as TaskStatus)}
              options={TASK_STATUSES.map((s) => {
                const statusKey = s.value === 'in_progress' ? 'inProgress' : s.value;
                return { value: s.value, label: t(`status.${statusKey}`) };
              })}
            />
          )}

          {priority !== undefined && onPriorityChange && (
            <FormSelectField
              id={priorityId}
              label={t('task.priority')}
              value={priority}
              onChange={(value) => onPriorityChange(value as TaskPriority | '')}
              options={TASK_PRIORITIES.map((p) => ({
                value: p.value,
                label: p.value ? t(`priority.${p.value}`) : t('priority.none'),
              }))}
            />
          )}
        </div>
      )}

      <FormSelectField
        id={groupId}
        label={t('task.group')}
        value={useCustomGroup ? '' : group}
        onChange={(value) => {
          onGroupChange(value);
          if (onUseCustomGroupChange) {
            onUseCustomGroupChange(false);
          }
        }}
        options={allGroups.map((g) => ({ value: g, label: g }))}
        disabled={useCustomGroup}
      />

      {/* Due Date Field */}
      {onDueDateChange && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={dueDateId}
            className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
          >
            {t('task.dueDate')}
          </label>
          <input
            id={dueDateId}
            type="date"
            value={dueDate || ''}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="px-3 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={
              {
                '--tw-ring-color': accentColor,
              } as React.CSSProperties & { '--tw-ring-color': string }
            }
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {showCustomGroup && onUseCustomGroupChange && onCustomGroupChange && (
          <>
            <CustomGroupCheckbox
              checked={useCustomGroup}
              onChange={onUseCustomGroupChange}
              onCustomGroupChange={onCustomGroupChange}
            />
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
    </>
  );
};
