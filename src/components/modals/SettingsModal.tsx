import React, { useState, useRef } from 'react';
import { IconUser, IconBarChart, IconCheckCircle, IconPalette } from '../Icons';
import { SettingsDetailModal, SettingsCategory } from './SettingsDetailModal';
import { CompletedTasksModal } from './CompletedTasksModal';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { SettingsCategoryButton } from '../settings/SettingsCategoryButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { PrimaryColor } from '../../contexts/ColorContext';
import { Task } from '../../types/task';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme: 'light' | 'dark' | 'system';
  onLanguageChange: (language: 'de' | 'en') => void;
  currentLanguage: 'de' | 'en';
  onPrimaryColorChange: (color: PrimaryColor) => void;
  currentPrimaryColor: PrimaryColor;
  onLogout?: () => void;
  onShowCompletedTasks?: () => void;
  completedTasksCount?: number;
  tasks?: any[];
  onStatusChange?: (id: string, status: any) => void;
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (task: Task) => void;
  onReactivate?: (id: string) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  onThemeChange,
  currentTheme,
  onLanguageChange,
  currentLanguage,
  onPrimaryColorChange,
  currentPrimaryColor,
  onLogout,
  onShowCompletedTasks,
  completedTasksCount = 0,
  tasks = [],
  onStatusChange = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  onReactivate = () => {},
}: SettingsModalProps) => {
  const { t } = useLanguage();
  const settingsCategories: Array<{
    id: SettingsCategory;
    title: string;
    description: string;
    icon?: React.ReactNode;
  }> = [
    {
      id: 'account',
      title: t('settings.account.title'),
      description: t('settings.account.description'),
      icon: <IconUser className="w-5 h-5" />,
    },
    {
      id: 'completed-tasks',
      title: t('settings.completedTasks.title'),
      description: `${completedTasksCount} ${completedTasksCount === 1 ? t('settings.completedTasks.task') : t('settings.completedTasks.tasks')} ${t('settings.completedTasks.description')}`,
      icon: <IconCheckCircle className="w-5 h-5" />,
    },
    {
      id: 'dashboard',
      title: t('settings.dashboard.title'),
      description: t('settings.dashboard.description'),
      icon: <IconBarChart className="w-5 h-5" />,
    },
    {
      id: 'appearance',
      title: t('settings.appearance.title'),
      description: `${t('settings.appearance.theme.title')}, ${t('settings.appearance.primaryColor.title')}, ${t('settings.appearance.language.title')}`,
      icon: <IconPalette className="w-5 h-5" />,
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategory | null>(null);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(false);
  const mainModalRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: SettingsCategory) => {
    if (category === 'completed-tasks') {
      // Open completed tasks modal as submodal
      setIsCompletedTasksOpen(true);
    } else {
      // Open detail modal for other categories
      setSelectedCategory(category);
    }
  };

  const handleCompletedTasksClose = () => {
    setIsCompletedTasksOpen(false);
  };

  const handleDetailClose = () => {
    setSelectedCategory(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <ResponsiveModal
        ref={mainModalRef}
        isOpen={isOpen}
        onClose={() => {
          // Only close if no submodal is open
          if (!selectedCategory && !isCompletedTasksOpen) {
            onClose();
          }
        }}
        title={t('settings.title')}
        zIndex={1001}
        offsetRight={0}
        level={1}
      >
        <div className="space-y-2">
          {settingsCategories.map((category) => {
            const isCompletedTasks = category.id === 'completed-tasks';
            const description = isCompletedTasks
              ? `${completedTasksCount} completed ${completedTasksCount === 1 ? 'task' : 'tasks'}`
              : category.description;

            return (
              <SettingsCategoryButton
                key={category.id}
                title={category.title}
                description={description}
                icon={category.icon}
                onClick={() => handleCategoryClick(category.id)}
              />
            );
          })}
        </div>
      </ResponsiveModal>
      <SettingsDetailModal
        isOpen={selectedCategory !== null}
        category={selectedCategory!}
        onClose={handleDetailClose}
        onLogout={onLogout}
        onShowCompletedTasks={onShowCompletedTasks}
        completedTasksCount={completedTasksCount}
        onThemeChange={onThemeChange}
        currentTheme={currentTheme}
        onLanguageChange={onLanguageChange}
        currentLanguage={currentLanguage}
        onPrimaryColorChange={onPrimaryColorChange}
        currentPrimaryColor={currentPrimaryColor}
        tasks={tasks}
        parentModalRef={mainModalRef}
      />
      <CompletedTasksModal
        isOpen={isCompletedTasksOpen}
        onClose={handleCompletedTasksClose}
        tasks={tasks}
        onStatusChange={onStatusChange}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onReactivate={onReactivate}
        parentModalRef={mainModalRef}
      />
    </>
  );
};
