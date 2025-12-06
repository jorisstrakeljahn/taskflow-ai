import { useState, useEffect, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/CreateTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { ChatModal } from './components/ChatModal';
import { SettingsModal } from './components/SettingsModal';
import { CompletedTasksModal } from './components/CompletedTasksModal';
import { SpeedDial } from './components/SpeedDial';
import { IconReset, IconSettings } from './components/Icons';
import { TaskPriority, Task, TaskStatus } from './types/task';
import { parseChatMessage } from './utils/aiParser';

function App() {
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    changeTaskStatus,
    deleteTask,
    resetToSampleTasks,
  } = useTasks();
  const { theme, setThemePreference } = useTheme();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCompletedTasksModalOpen, setIsCompletedTasksModalOpen] = useState(false);

  // Block body scroll when any modal is open (including settings detail modal)
  const isAnyModalOpen = isTaskModalOpen || isEditTaskModalOpen || isChatModalOpen || isSettingsModalOpen || isCompletedTasksModalOpen;

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

  const handleAddSubtask = (parentId: string, title: string) => {
    addTask(title, 'General', parentId);
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
      <header className="sticky top-0 z-50 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              TaskFlow AI
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={resetToSampleTasks}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                title="Reset to sample data"
              >
                <IconReset className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Settings"
              >
                <IconSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
            Loading tasks...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={changeTaskStatus}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onAddSubtask={handleAddSubtask}
            onEdit={handleEditTask}
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
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        existingGroups={existingGroups}
        onSubmit={handleSaveTaskEdit}
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
        onLogout={() => {
          // TODO: Implement logout logic
          console.log('Logout clicked');
        }}
        onShowCompletedTasks={() => setIsCompletedTasksModalOpen(true)}
        completedTasksCount={completedTasksCount}
        tasks={tasks}
        onStatusChange={changeTaskStatus}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onReactivate={handleReactivateTask}
      />
      {/* Keep this for direct access from other places if needed */}
      <CompletedTasksModal
        isOpen={isCompletedTasksModalOpen && !isSettingsModalOpen}
        onClose={() => setIsCompletedTasksModalOpen(false)}
        tasks={tasks}
        onStatusChange={changeTaskStatus}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onReactivate={handleReactivateTask}
        onEdit={handleEditTask}
      />
    </div>
  );
}

export default App;

