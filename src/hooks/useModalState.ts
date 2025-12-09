import { useState, useRef } from 'react';
import { Task } from '../types/task';

/**
 * Custom hook to manage all modal states in the application
 *
 * Centralizes modal state management including task modals, chat modal,
 * settings modal, and subtask modals. Provides helper functions for
 * opening/closing modals and tracking which modal is currently open.
 *
 * @returns Object containing all modal states and control functions
 *
 * @example
 * ```tsx
 * const {
 *   isTaskModalOpen,
 *   setIsTaskModalOpen,
 *   openEditTaskModal,
 *   closeEditTaskModal
 * } = useModalState();
 * ```
 */
export const useModalState = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCompletedTasksModalOpen, setIsCompletedTasksModalOpen] = useState(false);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [subtaskParentId, setSubtaskParentId] = useState<string | null>(null);
  const [subtaskParentTitle, setSubtaskParentTitle] = useState<string>('');
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const editTaskModalRef = useRef<HTMLDivElement>(null);

  const isAnyModalOpen =
    isTaskModalOpen ||
    isEditTaskModalOpen ||
    isChatModalOpen ||
    isSettingsModalOpen ||
    isCompletedTasksModalOpen ||
    isSubtaskModalOpen;

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setEditingTask(null);
  };

  const openDeleteConfirmModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setTaskToDelete(null);
  };

  const openSubtaskModal = (parentId: string, parentTitle: string) => {
    setSubtaskParentId(parentId);
    setSubtaskParentTitle(parentTitle);
    setIsSubtaskModalOpen(true);
  };

  const closeSubtaskModal = () => {
    setIsSubtaskModalOpen(false);
    setSubtaskParentId(null);
    setSubtaskParentTitle('');
  };

  return {
    // Task Modal
    isTaskModalOpen,
    setIsTaskModalOpen,

    // Edit Task Modal
    isEditTaskModalOpen,
    editingTask,
    openEditTaskModal,
    closeEditTaskModal,
    editTaskModalRef,

    // Chat Modal
    isChatModalOpen,
    setIsChatModalOpen,

    // Settings Modal
    isSettingsModalOpen,
    setIsSettingsModalOpen,

    // Completed Tasks Modal
    isCompletedTasksModalOpen,
    setIsCompletedTasksModalOpen,

    // Subtask Modal
    isSubtaskModalOpen,
    subtaskParentId,
    subtaskParentTitle,
    openSubtaskModal,
    closeSubtaskModal,

    // Delete Confirm Modal
    isDeleteConfirmModalOpen,
    taskToDelete,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,

    // Computed
    isAnyModalOpen,
  };
};
