import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconEdit, IconTrash, IconAddSubtask } from '../Icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskQuickActionsProps {
  onEdit?: () => void;
  onDelete: () => void;
  onAddSubtask?: () => void;
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  position?: 'hover' | 'context';
  contextMenuPosition?: { x: number; y: number } | null;
}

/**
 * Quick Actions Menu - appears on hover (desktop) or context menu (right-click)
 */
export const TaskQuickActions = ({
  onEdit,
  onDelete,
  onAddSubtask,
  triggerElement,
  isOpen,
  onClose,
  position = 'hover',
  contextMenuPosition,
}: TaskQuickActionsProps) => {
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (isOpen && triggerElement) {
      const updatePosition = () => {
        if (triggerElement && menuRef.current) {
          const rect = triggerElement.getBoundingClientRect();

          let top: number;
          let left: number;

          if (position === 'context' && contextMenuPosition) {
            // For context menu, use click position
            top = contextMenuPosition.y + window.scrollY;
            left = contextMenuPosition.x + window.scrollX;
          } else {
            // For hover menu, position relative to trigger element
            top = rect.top + window.scrollY;
            left = rect.right + window.scrollX + 8; // 8px gap from trigger
          }

          // Adjust if menu would go off-screen (only for hover menu)
          // Adjust if menu would go off-screen
          if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            if (left + menuRect.width > window.innerWidth + window.scrollX) {
              left =
                (position === 'context' ? contextMenuPosition?.x || 0 : rect.left) +
                window.scrollX -
                menuRect.width -
                8;
            }

            if (top + menuRect.height > window.innerHeight + window.scrollY) {
              top = window.innerHeight + window.scrollY - menuRect.height - 8;
            }

            if (left < window.scrollX) {
              left = window.scrollX + 8;
            }
          }

          setMenuPosition({ top, left });
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setMenuPosition(null);
    }
  }, [isOpen, triggerElement, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerElement &&
        !triggerElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, triggerElement, onClose]);

  if (!isOpen || !menuPosition || !triggerElement) return null;

  const actions = [
    ...(onAddSubtask
      ? [
          {
            label: t('task.addSubtask'),
            icon: IconAddSubtask,
            onClick: () => {
              onAddSubtask();
              onClose();
            },
            className: 'text-text-primary-light dark:text-text-primary-dark',
          },
        ]
      : []),
    ...(onEdit
      ? [
          {
            label: t('common.edit'),
            icon: IconEdit,
            onClick: () => {
              onEdit();
              onClose();
            },
            className: 'text-text-primary-light dark:text-text-primary-dark',
          },
        ]
      : []),
    {
      label: t('common.delete'),
      icon: IconTrash,
      onClick: () => {
        onDelete();
        onClose();
      },
      className: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={menuRef}
        className="fixed z-[10001] min-w-[180px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl py-1"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${action.className}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>,
      document.body
    )
  );
};
