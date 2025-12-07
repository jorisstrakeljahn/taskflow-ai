import { useState, useEffect, useMemo, useRef } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { ResponsiveModal } from './ResponsiveModal';
import { TaskFormFields } from './ui/TaskFormFields';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { getSubtasks } from '../utils/taskUtils';
import { IconPlus } from './Icons';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  existingGroups: string[];
  allTasks: Task[];
  onSubmit: (id: string, data: {
    title: string;
    description?: string;
    status: TaskStatus;
    group: string;
    priority?: TaskPriority;
  }) => void;
  onAddSubtask?: (parentId: string) => void;
  parentModalRef?: React.RefObject<HTMLDivElement>;
}

export const EditTaskModal = ({
  isOpen,
  onClose,
  task,
  existingGroups,
  allTasks,
  onSubmit,
  onAddSubtask,
  parentModalRef,
}: EditTaskModalProps) => {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('open');
  const [group, setGroup] = useState('General');
  const [customGroup, setCustomGroup] = useState('');
  const [useCustomGroup, setUseCustomGroup] = useState(false);
  const [priority, setPriority] = useState<TaskPriority | ''>('');

  const subtasks = useMemo(() => {
    if (!task) return [];
    return getSubtasks(allTasks, task.id);
  }, [task, allTasks]);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setGroup(task.group);
      setCustomGroup('');
      setUseCustomGroup(false);
      setPriority(task.priority || '');
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && task) {
      const selectedGroup = useCustomGroup && customGroup.trim() 
        ? customGroup.trim() 
        : group;
      
      onSubmit(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        group: selectedGroup,
        priority: priority || undefined,
      });
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  // Use parentModalRef if provided, otherwise use local modalRef
  const refToUse = parentModalRef || modalRef;

  return (
    <ResponsiveModal
      ref={refToUse}
      isOpen={isOpen}
      onClose={onClose}
      title={t('modals.editTask.title')}
      zIndex={1001}
      offsetRight={0}
      level={1}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 h-full"
      >
        <TaskFormFields
          title={title}
          description={description}
          status={status}
          group={group}
          priority={priority}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onStatusChange={setStatus}
          onGroupChange={setGroup}
          onPriorityChange={(value) => setPriority(value as TaskPriority | '')}
          existingGroups={existingGroups}
          showCustomGroup={true}
          customGroup={customGroup}
          onCustomGroupChange={setCustomGroup}
          useCustomGroup={useCustomGroup}
          onUseCustomGroupChange={setUseCustomGroup}
          showStatus={true}
          titleId="edit-task-title"
          descriptionId="edit-task-description"
          statusId="edit-task-status"
          groupId="edit-task-group"
          priorityId="edit-task-priority"
        />

        {/* Subtasks Section */}
        <div className="pt-3 border-t border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {t('modals.editTask.subtasks')} ({subtasks.length})
            </h3>
            {onAddSubtask && task && (
              <button
                type="button"
                onClick={() => {
                  onAddSubtask(task.id);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <IconPlus className="w-3.5 h-3.5" />
                {t('modals.editTask.addSubtask')}
              </button>
            )}
          </div>
          {subtasks.length === 0 ? (
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {t('modals.editTask.noSubtasks')}
            </p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                        {subtask.title}
                      </p>
                      {subtask.description && (
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5 line-clamp-1">
                          {subtask.description}
                        </p>
                      )}
                    </div>
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
                      {subtask.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 mt-4 pb-6">
          <Button type="submit" variant="primary" fullWidth className="text-sm py-2 min-h-[40px]">
            {t('modals.editTask.saveChanges')}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

