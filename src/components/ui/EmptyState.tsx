import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <p className="mb-2 text-base font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};
