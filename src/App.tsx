import { useMemo, useState } from 'react';
import { useTasksFirebase as useTasks } from './hooks/useTasksFirebase';
import { logger } from './utils/logger';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext';
import { useColor } from './contexts/ColorContext';
import { useAuth } from './contexts/AuthContext';
import { useModalState } from './hooks/useModalState';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { EditTaskModal } from './components/modals/EditTaskModal';
import { ChatModal } from './components/modals/ChatModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { CompletedTasksModal } from './components/modals/CompletedTasksModal';
import { DeleteTaskConfirmModal } from './components/modals/DeleteTaskConfirmModal';
import { LoginModal } from './components/auth/LoginModal';
import { SignUpModal } from './components/auth/SignUpModal';
import { SpeedDial } from './components/SpeedDial';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Task, TaskStatus, TaskPriority } from './types/task';
import { getSubtasks } from './utils/taskUtils';
import { prepareCreateTaskData, prepareEditTaskData } from './utils/modalHandlers';
import { generateTasksFromMessage, ParsedTask } from './services/openaiService';
import { useTaskHandlers } from './hooks/useTaskHandlers';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { tasks, isLoading, addTask, updateTask, changeTaskStatus, deleteTask, reorderTasks } =
    useTasks();
  const { theme, setThemePreference } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { primaryColor, setPrimaryColor } = useColor();

  // Modal state management
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    isEditTaskModalOpen,
    editingTask,
    openEditTaskModal,
    closeEditTaskModal,
    editTaskModalRef,
    isChatModalOpen,
    setIsChatModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isCompletedTasksModalOpen,
    setIsCompletedTasksModalOpen,
    isSubtaskModalOpen,
    subtaskParentId,
    subtaskParentTitle,
    openSubtaskModal,
    closeSubtaskModal,
    isDeleteConfirmModalOpen,
    taskToDelete,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    isAnyModalOpen,
  } = useModalState();

  // Lock body scroll when modals are open
  useBodyScrollLock(isAnyModalOpen);

  // Get all existing groups from tasks
  const existingGroups = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.group))).sort();
  }, [tasks]);

  // Task handlers hook - separates business logic from UI
  const {
    handleCreateSubtask: handleCreateSubtaskBase,
    handleCreateTask: handleCreateTaskBase,
    handleAddTasks,
    handleReactivateTask,
  } = useTaskHandlers({
    addTask,
    updateTask,
    changeTaskStatus,
  });

  const handleOpenSubtaskModal = (parentId: string) => {
    const parentTask = tasks.find((t) => t.id === parentId);
    openSubtaskModal(parentId, parentTask?.title || '');
  };

  // Wrap handlers to catch errors and show user-friendly messages
  const handleCreateSubtask = async (data: ReturnType<typeof prepareCreateTaskData>) => {
    try {
      await handleCreateSubtaskBase(data);
    } catch (error) {
      // Error is already logged in useTaskHandlers
      // Could add toast notification here in the future
    }
  };

  const handleCreateTask = async (data: ReturnType<typeof prepareCreateTaskData>) => {
    try {
      await handleCreateTaskBase(data);
    } catch (error) {
      // Error is already logged in useTaskHandlers
      // Could add toast notification here in the future
    }
  };

  const handleChatMessage = async (message: string): Promise<ParsedTask[]> => {
    // Get existing groups for AI context
    const groups = Array.from(new Set(tasks.map((t) => t.group))).sort();

    try {
      const parsedTasks = await generateTasksFromMessage(message, groups);
      return parsedTasks;
    } catch (error) {
      logger.error('Error generating tasks from OpenAI:', error);
      throw error; // Let ChatModal handle the error display
    }
  };

  const handleEditTask = (task: Task) => {
    openEditTaskModal(task);
  };

  const handleDeleteTask = (task: Task) => {
    openDeleteConfirmModal(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      closeDeleteConfirmModal();
    }
  };

  const handleSaveTaskEdit = (
    id: string,
    data: {
      title: string;
      description?: string;
      status: TaskStatus;
      group: string;
      priority?: TaskPriority;
    }
  ) => {
    const currentTask = tasks.find((t) => t.id === id);
    const updateData = prepareEditTaskData(currentTask, data);
    updateTask(id, updateData);
  };

  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
        <div className="max-w-md w-full text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            TaskFlow AI
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
            {t('auth.welcome')}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-3 rounded-lg bg-accent-light dark:bg-accent-dark text-white font-medium hover:opacity-90 transition-opacity"
          >
            {t('auth.login')}
          </button>
          <button
            onClick={() => setIsSignUpModalOpen(true)}
            className="px-6 py-3 rounded-lg border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('auth.signUp')}
          </button>
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToSignUp={() => {
            setIsLoginModalOpen(false);
            setIsSignUpModalOpen(true);
          }}
        />
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onSwitchToLogin={() => {
            setIsSignUpModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors">
      <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={changeTaskStatus}
            onUpdate={updateTask}
            onDelete={handleDeleteTask}
            onAddSubtask={handleOpenSubtaskModal}
            onEdit={handleEditTask}
            onReorder={reorderTasks}
          />
        )}
      </main>

      <SpeedDial
        onTaskClick={() => setIsTaskModalOpen(true)}
        onChatClick={() => setIsChatModalOpen(true)}
      />
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={(data) => handleCreateTask(prepareCreateTaskData(data))}
      />
      <CreateTaskModal
        isOpen={isSubtaskModalOpen}
        onClose={closeSubtaskModal}
        onSubmit={(data) => handleCreateSubtask(prepareCreateTaskData(data))}
        parentId={subtaskParentId || undefined}
        parentTaskTitle={subtaskParentTitle}
        isSubModal={isEditTaskModalOpen}
        parentModalRef={editTaskModalRef}
      />
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          // Only close if subtask modal is not open
          if (!isSubtaskModalOpen) {
            closeEditTaskModal();
          }
        }}
        task={editingTask}
        existingGroups={existingGroups}
        allTasks={tasks}
        onSubmit={handleSaveTaskEdit}
        onAddSubtask={handleOpenSubtaskModal}
        parentModalRef={editTaskModalRef}
      />
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onSendMessage={handleChatMessage}
        onAddTasks={handleAddTasks}
        existingGroups={existingGroups}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onThemeChange={setThemePreference}
        currentTheme={theme}
        onLanguageChange={setLanguage}
        currentLanguage={language}
        onPrimaryColorChange={setPrimaryColor}
        currentPrimaryColor={primaryColor}
        onLogout={async () => {
          await signOut();
        }}
        onShowCompletedTasks={() => setIsCompletedTasksModalOpen(true)}
        completedTasksCount={completedTasksCount}
        tasks={tasks}
        onStatusChange={changeTaskStatus}
        onUpdate={updateTask}
        onDelete={handleDeleteTask}
        onReactivate={handleReactivateTask}
      />
      {/* Keep this for direct access from other places if needed */}
      <CompletedTasksModal
        isOpen={isCompletedTasksModalOpen && !isSettingsModalOpen}
        onClose={() => setIsCompletedTasksModalOpen(false)}
        tasks={tasks}
        onStatusChange={changeTaskStatus}
        onUpdate={updateTask}
        onDelete={handleDeleteTask}
        onReactivate={handleReactivateTask}
        onEdit={handleEditTask}
      />
      <DeleteTaskConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
        subtasksCount={taskToDelete ? getSubtasks(tasks, taskToDelete.id).length : 0}
      />
    </div>
  );
}

export default App;
