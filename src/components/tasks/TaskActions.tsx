import { IconEdit, IconTrash, IconAddSubtask } from '../Icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskActionsProps {
  onAddSubtask?: (parentId: string) => void;
  onEdit?: () => void;
  onDelete: () => void;
  parentId: string;
}

export const TaskActions = ({
  onAddSubtask,
  onEdit,
  onDelete,
  parentId,
}: TaskActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-start gap-0.5 flex-shrink-0 -mt-0.5">
      {onAddSubtask && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddSubtask(parentId);
          }}
          className="p-1 rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors flex items-center justify-center"
          title={t('task.addSubtask')}
          aria-label={t('task.addSubtask')}
        >
          <IconAddSubtask className="w-4 h-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors flex items-center justify-center"
          title={t('common.edit')}
          aria-label={t('common.edit')}
        >
          <IconEdit className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center"
        title={t('common.delete')}
        aria-label={t('common.delete')}
      >
        <IconTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

