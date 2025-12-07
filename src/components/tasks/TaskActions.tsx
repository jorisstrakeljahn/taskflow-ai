import { IconEdit, IconTrash } from '../Icons';
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
    <div className="flex gap-1 flex-shrink-0">
      {onAddSubtask && (
        <button
          onClick={() => onAddSubtask(parentId)}
          className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={t('task.addSubtask')}
        >
          +
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={t('common.edit')}
        >
          <IconEdit className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onDelete}
        className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title={t('common.delete')}
      >
        <IconTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

