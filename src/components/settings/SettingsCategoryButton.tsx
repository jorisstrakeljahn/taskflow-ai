import { IconChevronRight } from '../Icons';

interface SettingsCategoryButtonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export const SettingsCategoryButton = ({
  title,
  description,
  icon,
  onClick,
}: SettingsCategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
    >
      <div className="flex items-center gap-3 flex-1 text-left">
        {icon && (
          <div className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
            {title}
          </div>
          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            {description}
          </div>
        </div>
      </div>
      <IconChevronRight className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors flex-shrink-0" />
    </button>
  );
};

