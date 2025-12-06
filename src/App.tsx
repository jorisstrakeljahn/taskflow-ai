import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { ChatModal } from './components/ChatModal';
import { SettingsModal } from './components/SettingsModal';
import { CompletedTasksModal } from './components/CompletedTasksModal';
import { SpeedDial } from './components/SpeedDial';
import { IconReset, IconSettings } from './components/Icons';
import { TaskPriority } from './types/task';
import { parseChatMessage } from './utils/aiParser';

type View = 'tasks' | 'dashboard';

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
  const { setThemePreference } = useTheme();
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCompletedTasksModalOpen, setIsCompletedTasksModalOpen] = useState(false);

  // Block body scroll when any modal is open (including settings detail modal)
  const isAnyModalOpen = isTaskModalOpen || isChatModalOpen || isSettingsModalOpen || isCompletedTasksModalOpen;

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

  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors">
      <header className="sticky top-0 z-50 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
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
                <span>Reset</span>
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
          <nav className="flex gap-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'tasks'
                  ? 'bg-accent-light dark:bg-accent-dark text-white'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setCurrentView('tasks')}
            >
              Tasks
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-accent-light dark:bg-accent-dark text-white'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
            Loading tasks...
          </div>
        ) : (
          <>
            {currentView === 'tasks' && (
              <TaskList
                tasks={tasks}
                onStatusChange={changeTaskStatus}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onAddSubtask={handleAddSubtask}
              />
            )}
            {currentView === 'dashboard' && <Dashboard tasks={tasks} />}
          </>
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
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onSendMessage={handleChatMessage}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onThemeChange={setThemePreference}
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
      />
    </div>
  );
}

export default App;

