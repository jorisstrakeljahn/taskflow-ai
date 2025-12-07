import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TaskPriority } from '../../types/task';
import { TASK_PRIORITIES } from '../../constants/taskConstants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccentColor } from '../../hooks/useAccentColor';
import { IconChevronDown, IconCheck } from '../Icons';
import { PRIORITY_COLORS } from '../../constants/uiConstants';

interface PrioritySelectorProps {
  currentPriority: TaskPriority | '';
  onPriorityChange: (priority: TaskPriority | '') => void;
  disabled?: boolean;
}

export const PrioritySelector = ({
  currentPriority,
  onPriorityChange,
  disabled = false,
}: PrioritySelectorProps) => {
  const { t } = useLanguage();
  const { accentColor } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const dropdownElement = document.querySelector('[data-priority-dropdown]');

      // Don't close if clicking inside the dropdown or button
      if (
        (containerRef.current && containerRef.current.contains(target)) ||
        (buttonRef.current && buttonRef.current.contains(target)) ||
        (dropdownElement && dropdownElement.contains(target))
      ) {
        return;
      }

      // Close if clicking outside
      setIsOpen(false);
      setDropdownPosition(null);
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
          });
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
      setDropdownPosition(null);
    }
  }, [isOpen]);

  const handlePriorityClick = (priority: TaskPriority | '', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (priority !== currentPriority && !disabled) {
      onPriorityChange(priority);
    }
    setIsOpen(false);
    setDropdownPosition(null);
  };

  if (disabled) {
    if (!currentPriority) {
      return null;
    }
    return (
      <span
        className={`px-2 py-0.5 text-xs rounded font-semibold bg-gray-100 dark:bg-gray-800 ${PRIORITY_COLORS[currentPriority]}`}
      >
        {t(`priority.${currentPriority}`)}
      </span>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative inline-block">
        {currentPriority ? (
          <button
            ref={buttonRef}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`px-2 py-0.5 text-xs rounded font-semibold bg-gray-100 dark:bg-gray-800 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 cursor-pointer ${PRIORITY_COLORS[currentPriority]}`}
            disabled={disabled}
          >
            {t(`priority.${currentPriority}`)}
            <IconChevronDown
              className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        ) : (
          <button
            ref={buttonRef}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-all hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 cursor-pointer"
            disabled={disabled}
          >
            {t('priority.none')}
            <IconChevronDown
              className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {isOpen &&
        dropdownPosition &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            data-priority-dropdown
            className="fixed z-[10000] min-w-[140px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg py-1"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {TASK_PRIORITIES.map((priority) => {
              const isSelected = priority.value === currentPriority;
              return (
                <button
                  key={priority.value || 'none'}
                  type="button"
                  onClick={(e) => handlePriorityClick(priority.value as TaskPriority | '', e)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? 'bg-accent-light/10 dark:bg-accent-dark/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  style={
                    isSelected
                      ? {
                          color: accentColor,
                        }
                      : {}
                  }
                >
                  <span
                    className={
                      priority.value
                        ? PRIORITY_COLORS[priority.value]
                        : 'text-text-primary-light dark:text-text-primary-dark'
                    }
                  >
                    {priority.value ? t(`priority.${priority.value}`) : t('priority.none')}
                  </span>
                  {isSelected && (
                    <span style={{ color: accentColor }}>
                      <IconCheck className="w-4 h-4 flex-shrink-0" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};
