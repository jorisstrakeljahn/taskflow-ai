# API Documentation

## Overview

This document describes the main APIs, hooks, and services available in TaskFlow AI.

## Hooks

### `useTasksFirebase`

Main hook for task management with Firebase integration.

**Returns:**

```typescript
{
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, group?: string, parentId?: string) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  changeTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (activeId: string, overId: string) => Promise<void>;
}
```

**Example:**

```tsx
const { tasks, addTask, updateTask } = useTasksFirebase();

// Create a task
await addTask('Buy groceries', 'Shopping');

// Update a task
await updateTask(taskId, { title: 'Updated title' });
```

---

### `useTaskHandlers`

Hook for task-related business logic, separating concerns from UI components.

**Parameters:**

```typescript
{
  addTask: (title: string, group: string, parentId?: string) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  changeTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
}
```

**Returns:**

```typescript
{
  createTaskWithDetails: (title, group, parentId?, description?, priority?) => Promise<Task>;
  handleCreateSubtask: (data: CreateTaskData) => Promise<void>;
  handleCreateTask: (data: CreateTaskData) => Promise<void>;
  handleAddTasks: (parsedTasks: ParsedTask[], existingTasks?: Task[]) => Promise<void>;
  handleReactivateTask: (id: string) => void;
}
```

**Example:**

```tsx
const { handleCreateTask, handleAddTasks } = useTaskHandlers({
  addTask,
  updateTask,
  changeTaskStatus,
});

// Create task with details
await handleCreateTask({
  title: 'Finish presentation',
  group: 'Work',
  description: 'Due tomorrow',
  priority: 'high',
});

// Add multiple tasks from AI
await handleAddTasks(parsedTasks, existingTasks);
```

---

### `useChatState`

Hook for managing chat interface state and operations.

**Parameters:**

```typescript
{
  onSendMessage: (message: string, conversationHistory: Array<...>) => Promise<ParsedTask[]>;
  onAddTasks: (tasks: ParsedTask[]) => Promise<void>;
}
```

**Returns:**

```typescript
{
  messages: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  isProcessing: boolean;
  error: string | null;
  editingTaskId: string | null;
  editedTask: EditableTask | null;
  handleSendMessage: () => Promise<void>;
  handleRegenerate: () => Promise<void>;
  handleTaskAction: (task, action) => Promise<void>;
  handleEditTask: (taskId, task) => void;
  handleSaveEdit: () => Promise<void>;
  handleCancelEdit: () => void;
  handleUpdateEditedTask: (updates) => void;
  handleResetChat: () => void;
  showRegenerate: boolean;
}
```

**Example:**

```tsx
const { messages, handleSendMessage, handleAddTasks } = useChatState({
  onSendMessage: generateTasksFromMessage,
  onAddTasks: addTasksToFirebase,
});
```

---

### `useModalState`

Hook for managing all modal states in the application.

**Returns:**

```typescript
{
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isEditTaskModalOpen: boolean;
  editingTask: Task | null;
  openEditTaskModal: (task: Task) => void;
  closeEditTaskModal: () => void;
  // ... other modal states
  isAnyModalOpen: boolean;
}
```

---

### `useKeyboardShortcuts`

Hook for global keyboard shortcuts.

**Parameters:**

```typescript
{
  onChatOpen?: () => void;
  onTaskCreate?: () => void;
  onModalClose?: () => void;
  isModalOpen?: boolean;
}
```

**Shortcuts:**

- `Ctrl/Cmd + K`: Open chat
- `Ctrl/Cmd + N`: Create new task
- `Escape`: Close modal

---

### `useFocusTrap`

Hook for trapping focus within modals for accessibility.

**Parameters:**

```typescript
{
  isActive: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}
```

**Returns:** `React.MutableRefObject<HTMLElement | null>`

---

## Services

### `openaiService`

Service for communicating with OpenAI API.

#### `generateTasksFromMessage`

Generate tasks from natural language using OpenAI.

**Parameters:**

- `message: string` - User's natural language message
- `existingGroups?: string[]` - List of existing task groups
- `conversationHistory?: Array<{role, content}>` - Previous conversation messages

**Returns:** `Promise<ParsedTask[]>`

**Example:**

```ts
const tasks = await generateTasksFromMessage(
  'I need to buy groceries and finish the presentation',
  ['Work', 'Personal']
);
```

---

### `taskService`

Service for Firestore task operations.

#### `getTasks(userId: string): Promise<Task[]>`

Fetch all tasks for a user.

#### `subscribeToTasks(userId: string, callback: (tasks: Task[]) => void): Unsubscribe`

Subscribe to real-time task updates.

#### `createTask(task: Omit<Task, 'id'>): Promise<string>`

Create a new task. Returns Firestore document ID.

#### `updateTask(taskId: string, updates: Partial<Task>): Promise<void>`

Update an existing task.

#### `deleteTask(taskId: string): Promise<void>`

Delete a task.

#### `deleteTaskWithSubtasks(taskId: string, allTasks: Task[]): Promise<void>`

Delete a task and all its subtasks.

---

### `authService`

Service for Firebase Authentication operations.

#### `signUp(data: SignUpData): Promise<UserCredential>`

Create a new user account.

**Parameters:**

```typescript
{
  email: string;
  password: string;
  displayName?: string;
}
```

#### `signIn(data: SignInData): Promise<UserCredential>`

Sign in an existing user.

**Parameters:**

```typescript
{
  email: string;
  password: string;
}
```

#### `signOutUser(): Promise<void>`

Sign out the current user.

#### `resetPassword(email: string): Promise<void>`

Send password reset email.

#### `getCurrentUser(): User | null`

Get the current authenticated user.

#### `getCurrentUserId(): string | null`

Get the current user ID.

---

## Types

### `Task`

```typescript
interface Task {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'done';
  group: string;
  userId: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  parentId?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### `ParsedTask`

```typescript
interface ParsedTask {
  title: string;
  group: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  parentId?: string; // Reference to parent task title
}
```

### `ChatMessage`

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tasks?: ParsedTask[];
}
```

---

## Error Handling

All async functions throw errors that should be caught and handled:

```tsx
try {
  await addTask('New task', 'Work');
} catch (error) {
  logger.error('Failed to create task:', error);
  // Show user-friendly error message
}
```

---

## Best Practices

1. **Always handle errors** - Wrap async operations in try-catch blocks
2. **Use optimistic updates** - Update UI immediately, sync with Firestore in background
3. **Clean up subscriptions** - Unsubscribe from Firestore listeners when components unmount
4. **Validate input** - Check user input before sending to services
5. **Log operations** - Use the logger utility for debugging

---

## See Also

- [Firebase Setup](firebase-setup.md) - Firebase configuration
- [AI Integration](ai-integration.md) - OpenAI integration details
- [Development Guide](development.md) - Development workflow
