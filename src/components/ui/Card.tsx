import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

/**
 * Reusable Card component with consistent styling
 */
export const Card = ({ children, className = '', onClick, style }: CardProps) => {
  return (
    <div
      className={`bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

