import { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface TaskCardProps {
  children: ReactNode;
  level?: number;
  isCompleting?: boolean;
  isDone?: boolean;
  isSwiping?: boolean;
  swipeOffset?: number;
  className?: string;
}

/**
 * Reusable Task Card component with consistent styling and animations
 */
export const TaskCard = ({
  children,
  level = 0,
  isCompleting = false,
  isDone = false,
  isSwiping = false,
  swipeOffset = 0,
  className = '',
}: TaskCardProps) => {
  return (
    <Card
      className={`p-3 mb-2 transition-all duration-500 ${
        isDone && !isCompleting
          ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50'
          : 'hover:shadow-sm'
      } ${
        isCompleting 
          ? 'scale-95 opacity-0 transform transition-all duration-500 ease-out' 
          : 'scale-100 opacity-100'
      } ${isSwiping ? 'transition-none' : ''} ${className}`}
      style={{ 
        marginLeft: `${level * 20}px`,
        transform: isSwiping ? `translateX(${swipeOffset}px)` : undefined,
        opacity: isSwiping && Math.abs(swipeOffset) > 40 ? 0.7 : undefined,
      }}
    >
      {children}
    </Card>
  );
};

