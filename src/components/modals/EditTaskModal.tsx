import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { TaskFormFields } from '../ui/TaskFormFields';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { getSubtasks } from '../../utils/taskUtils';
import { SubtasksSection } from '../tasks/SubtasksSection';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  existingGroups: string[];
  allTasks: Task[];
  onSubmit: (
    id: string,
    data: {
      title: string;
      description?: string;
      status: TaskStatus;
      group: string;
      priority?: TaskPriority;
    }
  ) => void;
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
  const [group, setGroup] = useState('General');
  const [customGroup, setCustomGroup] = useState('');
  const [useCustomGroup, setUseCustomGroup] = useState(false);

  const subtasks = useMemo(() => {
    if (!task) return [];
    return getSubtasks(allTasks, task.id);
  }, [task, allTasks]);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setGroup(task.group);
      setCustomGroup('');
      setUseCustomGroup(false);
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && task) {
      const selectedGroup = useCustomGroup && customGroup.trim() ? customGroup.trim() : group;

      onSubmit(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status: task.status, // Keep current status (changed via StatusSelector)
        group: selectedGroup,
        priority: task.priority, // Keep current priority (changed via PrioritySelector)
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-full">
        <TaskFormFields
          title={title}
          description={description}
          group={group}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onGroupChange={setGroup}
          existingGroups={existingGroups}
          showCustomGroup={true}
          customGroup={customGroup}
          onCustomGroupChange={setCustomGroup}
          useCustomGroup={useCustomGroup}
          onUseCustomGroupChange={setUseCustomGroup}
          titleId="edit-task-title"
          descriptionId="edit-task-description"
          groupId="edit-task-group"
        />

        {/* Subtasks Section */}
        {task && (
          <SubtasksSection subtasks={subtasks} onAddSubtask={onAddSubtask} parentId={task.id} />
        )}

        <div className="flex gap-2 pt-2 mt-4 pb-6">
          <Button type="submit" variant="primary" fullWidth className="text-sm py-2 min-h-[40px]">
            {t('modals.editTask.saveChanges')}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};
