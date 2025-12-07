import { useState, useEffect, useMemo, useRef } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext';
import { useColor } from './contexts/ColorContext';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/CreateTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { ChatModal } from './components/ChatModal';
import { SettingsModal } from './components/SettingsModal';
import { CompletedTasksModal } from './components/CompletedTasksModal';
import { DeleteTaskConfirmModal } from './components/DeleteTaskConfirmModal';
import { SpeedDial } from './components/SpeedDial';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { TaskPriority, Task, TaskStatus } from './types/task';
import { parseChatMessage } from './utils/aiParser';
import { getSubtasks } from './utils/taskUtils';

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

  // Block body scroll when any modal is open (including settings detail modal)
  // Note: DeleteConfirmModal handles its own body scroll lock
  const isAnyModalOpen = isTaskModalOpen || isEditTaskModalOpen || isChatModalOpen || isSettingsModalOpen || isCompletedTasksModalOpen || isSubtaskModalOpen;

  // Get all existing groups from tasks
  const existingGroups = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.group))).sort();
  }, [tasks]);

  useEffect(() => {
    if (isAnyModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Block body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isAnyModalOpen]);

  const handleOpenSubtaskModal = (parentId: string) => {
    const parentTask = tasks.find((t) => t.id === parentId);
    setSubtaskParentId(parentId);
    setSubtaskParentTitle(parentTask?.title || '');
    setIsSubtaskModalOpen(true);
  };

  const handleCreateSubtask = (data: {
    title: string;
    description?: string;
    group: string;
    priority?: TaskPriority;
    parentId?: string;
  }) => {
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

  const handleCreateTask = (data: {
    title: string;
    description?: string;
    group: string;
    priority?: TaskPriority;
  }) => {
    // Create task with all data at once
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
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
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
    const statusChangedToDone = data.status === 'done' && currentTask?.status !== 'done';
    const statusChangedFromDone = data.status !== 'done' && currentTask?.status === 'done';

    updateTask(id, {
      title: data.title,
      description: data.description,
      status: data.status,
      group: data.group,
      priority: data.priority,
      completedAt: statusChangedToDone 
        ? new Date() 
        : statusChangedFromDone 
          ? undefined 
          : currentTask?.completedAt,
    });
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
        onSubmit={handleCreateTask}
      />
      <CreateTaskModal
        isOpen={isSubtaskModalOpen}
        onClose={() => {
          setIsSubtaskModalOpen(false);
          setSubtaskParentId(null);
          setSubtaskParentTitle('');
        }}
        onSubmit={handleCreateSubtask}
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
            setIsEditTaskModalOpen(false);
            setEditingTask(null);
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
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
        subtasksCount={taskToDelete ? getSubtasks(tasks, taskToDelete.id).length : 0}
      />
    </div>
  );
}

export default App;

