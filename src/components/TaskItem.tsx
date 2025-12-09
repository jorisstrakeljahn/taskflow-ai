import { useState, useRef, useEffect, memo } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskCheckbox, TaskBadges, TaskActions, TaskCard } from './tasks';
import { useTaskSwipe } from '../hooks/useTaskSwipe';
import { useIsMobile } from '../hooks/useIsMobile';
import { TaskQuickActions } from './tasks/TaskQuickActions';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (task: Task) => void;
  onAddSubtask?: (parentId: string) => void;
  onEdit?: (task: Task) => void;
  subtasks?: Task[];
  level?: number;
  disableStatusChange?: boolean;
}

const TaskItemComponent = ({
  task,
  onStatusChange,
  onUpdate,
  onDelete,
  onAddSubtask,
  onEdit,
  subtasks = [],
  level = 0,
  disableStatusChange = false,
}: TaskItemProps) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(task.status === 'done');
  const [isHovered, setIsHovered] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const taskRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Swipe gestures for mobile
  const { swipeOffset, isSwiping, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTaskSwipe({
      onSwipeLeft: () => onDelete(task),
      onSwipeRight: onEdit ? () => onEdit(task) : undefined,
      threshold: 80,
    });

  // Context menu handler
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu on click outside
  useEffect(() => {
    if (showContextMenu) {
      const handleClick = () => setShowContextMenu(false);
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showContextMenu]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disableStatusChange) {
      // Prevent status change when disabled
      e.preventDefault();
      return;
    }

    const newStatus = e.target.checked ? 'done' : 'open';
    const isSubtask = !!task.parentId;

    if (newStatus === 'done') {
      // First show the checkmark
      setShowCheckmark(true);

      if (isSubtask) {
        // For subtasks: just update status without animation (they stay visible)
        setTimeout(() => {
          onStatusChange(task.id, newStatus);
        }, 200);
      } else {
        // For root tasks: use the fade-out animation
        setTimeout(() => {
          setIsCompleting(true);
          setTimeout(() => {
            onStatusChange(task.id, newStatus);
            setTimeout(() => {
              setIsCompleting(false);
            }, 100);
          }, 400);
        }, 300);
      }
    } else {
      setShowCheckmark(false);
      setIsCompleting(false);
      onStatusChange(task.id, newStatus);
    }
  };

  // Check if mobile (for swipe gestures and always-visible buttons)
  const isMobile = useIsMobile();

  return (
    <div
      ref={taskRef}
      onMouseEnter={() => {
        if (!isMobile) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsHovered(false);
        }
      }}
      onContextMenu={(e) => {
        // Context menu works on both, but only show on desktop
        if (!isMobile) {
          handleContextMenu(e);
        }
      }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <TaskCard
        level={level}
        isCompleting={isCompleting}
        isDone={task.status === 'done'}
        isSwiping={isSwiping}
        swipeOffset={swipeOffset}
      >
        <div className="flex items-start gap-3">
          <TaskCheckbox
            checked={task.status === 'done'}
            onChange={handleCheckboxChange}
            disabled={disableStatusChange}
            showCheckmark={showCheckmark}
            aria-label={`${task.status === 'done' ? 'Mark as open' : 'Mark as done'}: ${task.title}`}
          />
          <div className="flex-1 min-w-0">
            {/* Title row with actions - aligned to first line */}
            <div className="flex items-start justify-between gap-2">
              <span
                className={`flex-1 font-semibold text-base leading-tight ${
                  task.status === 'done'
                    ? 'line-through text-text-secondary-light dark:text-text-secondary-dark'
                    : 'text-text-primary-light dark:text-text-primary-dark'
                }`}
              >
                {task.title}
              </span>
              <div ref={actionsRef}>
                {/* Mobile: Always show icons + swipe gestures */}
                {/* Desktop: Show icons on hover + hover menu */}
                {isMobile ? (
                  // Mobile: Icons always visible
                  <TaskActions
                    onAddSubtask={onAddSubtask}
                    onEdit={onEdit ? () => onEdit(task) : undefined}
                    onDelete={() => onDelete(task)}
                    parentId={task.id}
                  />
                ) : (
                  // Desktop: Icons only on hover, plus hover menu
                  <>
                    {isHovered && (
                      <TaskActions
                        onAddSubtask={onAddSubtask}
                        onEdit={onEdit ? () => onEdit(task) : undefined}
                        onDelete={() => onDelete(task)}
                        parentId={task.id}
                      />
                    )}
                    {/* Hover menu for desktop - appears next to task */}
                    {isHovered && taskRef.current && (
                      <TaskQuickActions
                        onEdit={onEdit ? () => onEdit(task) : undefined}
                        onDelete={() => onDelete(task)}
                        onAddSubtask={onAddSubtask ? () => onAddSubtask(task.id) : undefined}
                        triggerElement={taskRef.current}
                        isOpen={isHovered}
                        onClose={() => setIsHovered(false)}
                        position="hover"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Context menu */}
            {showContextMenu && contextMenuPosition && (
              <TaskQuickActions
                onEdit={onEdit ? () => onEdit(task) : undefined}
                onDelete={() => onDelete(task)}
                onAddSubtask={onAddSubtask ? () => onAddSubtask(task.id) : undefined}
                triggerElement={taskRef.current}
                isOpen={showContextMenu}
                onClose={() => setShowContextMenu(false)}
                position="context"
                contextMenuPosition={contextMenuPosition}
              />
            )}
            {/* Description and badges - full width */}
            {task.description && (
              <span className="block text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                {task.description}
              </span>
            )}
            <TaskBadges
              task={task}
              onStatusChange={onStatusChange}
              onUpdate={onUpdate}
              disableStatusChange={disableStatusChange}
            />
          </div>
        </div>
        {subtasks.length > 0 && (
          <div className="mt-3 pl-3 border-l-2 border-border-light dark:border-border-dark">
            {subtasks.map((subtask) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                onStatusChange={onStatusChange}
                onUpdate={onUpdate}
                onDelete={(task) => onDelete(task)}
                onEdit={onEdit}
                level={level + 1}
                disableStatusChange={disableStatusChange}
              />
            ))}
          </div>
        )}
      </TaskCard>
    </div>
  );
};

// Custom comparison function for React.memo
const areEqual = (prevProps: TaskItemProps, nextProps: TaskItemProps): boolean => {
  // Compare task properties that affect rendering
  if (
    prevProps.task.id !== nextProps.task.id ||
    prevProps.task.title !== nextProps.task.title ||
    prevProps.task.status !== nextProps.task.status ||
    prevProps.task.description !== nextProps.task.description ||
    prevProps.task.priority !== nextProps.task.priority ||
    prevProps.task.group !== nextProps.task.group ||
    prevProps.task.parentId !== nextProps.task.parentId ||
    prevProps.task.order !== nextProps.task.order ||
    prevProps.level !== nextProps.level ||
    prevProps.disableStatusChange !== nextProps.disableStatusChange
  ) {
    return false;
  }

  // Compare subtasks array length and IDs
  const prevSubtasks = prevProps.subtasks || [];
  const nextSubtasks = nextProps.subtasks || [];
  if (prevSubtasks.length !== nextSubtasks.length) {
    return false;
  }

  // Check if subtask IDs match (shallow comparison)
  for (let i = 0; i < prevSubtasks.length; i++) {
    if (prevSubtasks[i].id !== nextSubtasks[i].id) {
      return false;
    }
  }

  // Function references are compared by React.memo automatically
  // If they change, the component will re-render
  return true;
};

export const TaskItem = memo(TaskItemComponent, areEqual);
