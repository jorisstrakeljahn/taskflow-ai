import { useMemo, useState, memo, useCallback } from 'react';
import { Task } from '../types/task';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getRootTasks, getSubtasks } from '../utils/taskUtils';
import { TaskFilters } from './TaskFilters';
import { EmptyState } from './ui/EmptyState';
import { useLanguage } from '../contexts/LanguageContext';
import { SortableTaskItem } from './tasks/SortableTaskItem';
import { useTaskFilters } from '../hooks/useTaskFilters';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Task['status']) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (task: Task) => void;
  onAddSubtask: (parentId: string) => void;
  onEdit?: (task: Task) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

const TaskListComponent = ({
  tasks,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
  onEdit,
  onReorder,
}: TaskListProps) => {
  const { t } = useLanguage();
  const [isDragMode, setIsDragMode] = useState<boolean>(false);

  const {
    filterGroup,
    filterStatus,
    filterPriority,
    setFilterGroup,
    setFilterStatus,
    setFilterPriority,
    filteredTasks,
    resetFilters,
  } = useTaskFilters(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // Wait 150ms before drag starts (long press)
        tolerance: 5, // Allow 5px of movement during delay
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id && onReorder) {
        onReorder(active.id as string, over.id as string);
      }
    },
    [onReorder]
  );

  const groups = useMemo(() => {
    const uniqueGroups = Array.from(new Set(tasks.map((t) => t.group)));
    return uniqueGroups.sort();
  }, [tasks]);

  const rootTasks = useMemo(() => {
    return getRootTasks(filteredTasks);
  }, [filteredTasks]);

  const handleAddSubtask = useCallback(
    (parentId: string) => {
      onAddSubtask(parentId);
    },
    [onAddSubtask]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 mb-4">
        <TaskFilters
          filterGroup={filterGroup}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          groups={groups}
          onGroupChange={setFilterGroup}
          onStatusChange={setFilterStatus}
          onPriorityChange={setFilterPriority}
          onReset={resetFilters}
          isDragMode={isDragMode}
          onDragModeToggle={setIsDragMode}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {rootTasks.length === 0 ? (
          <EmptyState title={t('task.noTasks')} description={t('task.noTasksDescription')} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rootTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {rootTasks.map((task) => {
                const subtasks = getSubtasks(filteredTasks, task.id);
                return (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onAddSubtask={handleAddSubtask}
                    onEdit={onEdit}
                    subtasks={subtasks}
                    showDragHandle={isDragMode}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export const TaskList = memo(TaskListComponent);
