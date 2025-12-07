import { useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext';
import { useColor } from './contexts/ColorContext';
import { useModalState } from './hooks/useModalState';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { EditTaskModal } from './components/modals/EditTaskModal';
import { ChatModal } from './components/modals/ChatModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { CompletedTasksModal } from './components/modals/CompletedTasksModal';
import { DeleteTaskConfirmModal } from './components/modals/DeleteTaskConfirmModal';
import { SpeedDial } from './components/SpeedDial';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Task, TaskStatus, TaskPriority } from './types/task';
import { parseChatMessage } from './utils/aiParser';
import { getSubtasks } from './utils/taskUtils';
import { prepareCreateTaskData, prepareEditTaskData } from './utils/modalHandlers';

function App() {
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    changeTaskStatus,
    deleteTask,
    reorderTasks,
  } = useTasks();
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

  const handleOpenSubtaskModal = (parentId: string) => {
    const parentTask = tasks.find((t) => t.id === parentId);
    openSubtaskModal(parentId, parentTask?.title || '');
  };

  const handleCreateSubtask = (data: ReturnType<typeof prepareCreateTaskData>) => {
    if (data.parentId) {
      const newTask = addTask(data.title, data.group, data.parentId);
      if (data.description || data.priority) {
        updateTask(newTask.id, {
          description: data.description,
          priority: data.priority,
        });
      }
    }
  };

  const handleCreateTask = (data: ReturnType<typeof prepareCreateTaskData>) => {
    const newTask = addTask(data.title, data.group, undefined);
    if (data.description || data.priority) {
      updateTask(newTask.id, {
        description: data.description,
        priority: data.priority,
      });
    }
  };

  const handleChatMessage = async (message: string) => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const parsedTasks = parseChatMessage(message);
      parsedTasks.forEach((task) => {
        addTask(task.title, task.group, task.parentId);
      });
    } catch (error) {
      console.error('Error parsing message:', error);
      // Fallback: create a single task from the message
      addTask(message, 'General');
    }
  };

  const handleReactivateTask = (id: string) => {
    changeTaskStatus(id, 'open');
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

  const handleSaveTaskEdit = (id: string, data: {
    title: string;
    description?: string;
    status: TaskStatus;
    group: string;
    priority?: TaskPriority;
  }) => {
    const currentTask = tasks.find((t) => t.id === id);
    const updateData = prepareEditTaskData(currentTask, data);
    updateTask(id, updateData);
  };

  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;

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
        onLogout={() => {
          // TODO: Implement logout logic
          console.log('Logout clicked');
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

