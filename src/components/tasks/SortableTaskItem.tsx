import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '../../types/task';
import { TaskItem } from '../TaskItem';
import { IconGripVertical } from '../Icons';

interface SortableTaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (task: Task) => void;
  onAddSubtask?: (parentId: string) => void;
  onEdit?: (task: Task) => void;
  subtasks?: Task[];
  level?: number;
  disableStatusChange?: boolean;
  showDragHandle?: boolean;
}

export const SortableTaskItem = ({
  task,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
  onEdit,
  subtasks = [],
  level = 0,
  disableStatusChange = false,
  showDragHandle = false,
}: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !!task.parentId || disableStatusChange, // Disable drag for subtasks
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.02 : 1,
  };

  // Only allow dragging root tasks (no parentId) and when drag mode is enabled
  const isDraggable = !task.parentId && !disableStatusChange && showDragHandle;

  return (
    <div
      ref={isDraggable ? setNodeRef : undefined}
      style={style}
      className={`relative ${isDragging ? 'z-50 shadow-lg' : ''}`}
    >
      {isDraggable && showDragHandle ? (
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="mt-3 cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0"
            title="Hold and drag to reorder"
          >
            <IconGripVertical
              className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
              size={20}
            />
          </div>
          <div className="flex-1">
            <TaskItem
              task={task}
              onStatusChange={onStatusChange}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
              onEdit={onEdit}
              subtasks={subtasks}
              level={level}
              disableStatusChange={disableStatusChange}
            />
          </div>
        </div>
      ) : (
        <TaskItem
          task={task}
          onStatusChange={onStatusChange}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddSubtask={onAddSubtask}
          onEdit={onEdit}
          subtasks={subtasks}
          level={level}
          disableStatusChange={disableStatusChange}
        />
      )}
    </div>
  );
};

