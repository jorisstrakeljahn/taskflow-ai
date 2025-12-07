import { Task } from '../../types/task';
import { IconPlus } from '../Icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface SubtasksSectionProps {
  subtasks: Task[];
  onAddSubtask?: (parentId: string) => void;
  parentId: string;
}

export const SubtasksSection = ({ subtasks, onAddSubtask, parentId }: SubtasksSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="pt-3 border-t border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          {t('modals.editTask.subtasks')} ({subtasks.length})
        </h3>
        {onAddSubtask && (
          <button
            type="button"
            onClick={() => {
              onAddSubtask(parentId);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <IconPlus className="w-3.5 h-3.5" />
            {t('modals.editTask.addSubtask')}
          </button>
        )}
      </div>
      {subtasks.length === 0 ? (
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          {t('modals.editTask.noSubtasks')}
        </p>
      ) : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-border-light dark:border-border-dark"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                    {subtask.title}
                  </p>
                  {subtask.description && (
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5 line-clamp-1">
                      {subtask.description}
                    </p>
                  )}
                </div>
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
                  {subtask.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
