# Features Documentation

Complete overview of TaskFlow AI features and functionality.

## Core Features

### AI-Powered Task Creation

Convert unstructured thoughts into clean, organized tasks through natural language chat using OpenAI GPT-4o-mini.

- **Natural Language Processing**: Understands conversational input
- **Automatic Task Parsing**: Extracts multiple tasks from single message
- **Smart Group Assignment**: Uses existing groups or creates new ones
- **Priority Detection**: Identifies urgent, important, or optional tasks
- **Task Suggestions**: Review and edit before adding
- **Regenerate**: Get new suggestions with different wording

### Task Management

Full CRUD operations for tasks:

- **Create**: Manual creation via modal or AI chat
- **Read**: Real-time task list with filtering
- **Update**: Edit title, description, status, priority, group
- **Delete**: Delete tasks with subtask cascade

### Subtask Support

Hierarchical task structure:

- Unlimited nesting levels
- Subtasks inherit parent group
- Completed subtasks remain visible under parent
- Subtasks sorted: incomplete first, then completed

### Smart Organization

- **Groups**: Categorize tasks (Work, Personal, Health, etc.)
- **Custom Groups**: Create new groups on the fly
- **Group Filtering**: Filter tasks by group

### Advanced Filtering

- **Status**: Open, In Progress, Done
- **Priority**: Low, Medium, High
- **Group**: Filter by category
- **Combined Filters**: Multiple filters active simultaneously

### Status Quick-Change

Change task status with a single click:

- Dropdown selector directly in task item
- No need to open edit modal
- Visual feedback with status badges

### Priority Management

- Three priority levels: Low, Medium, High
- Priority selector in task item
- Priority badges for visual identification

## User Experience

### Dark Mode

- Light, dark, and system theme support
- Smooth theme transitions
- Persistent theme preference

### Customization

- **Primary Color**: Choose from 10+ accent colors
- **Dynamic Theming**: Accent color applied throughout UI
- **Text Color**: Automatic black/white based on background

### Internationalization

- English (default)
- German (full translation)
- Easy to extend with new languages

### Mobile-First Design

- Touch-optimized interactions
- Swipe gestures for quick actions
- Responsive modals (slide-up on mobile)
- Drag & drop reordering

### Real-Time Sync

- Firebase-powered synchronization
- Cross-device updates
- Offline support (with sync on reconnect)

## Advanced Features

### Drag & Drop Reordering

- Intuitive task reordering
- Visual feedback during drag
- Persistent order storage
- Toggle drag mode on/off

### Quick Actions

- **Mobile**: Swipe gestures
- **Desktop**: Hover menu
- **Context Menu**: Right-click support
- Actions: Edit, Delete, Add Subtask

### Task Details

- **Title**: Required
- **Description**: Optional, always visible
- **Status**: Open, In Progress, Done
- **Priority**: Low, Medium, High
- **Group**: Category assignment
- **Timestamps**: Created, updated, completed

### Smart Completion

- Completed subtasks remain visible
- Sorted to bottom of subtask list
- Visual distinction (opacity)
- Not shown in global completed tasks view

### Settings

- **Account**: User info, password reset, logout
- **Appearance**: Theme, primary color, language
- **Completed Tasks**: View, edit, delete, reactivate

## Technical Features

### Real-Time Updates

- Firestore real-time listeners
- Automatic UI updates
- Optimistic updates for instant feedback

### Offline Support

- Firestore offline persistence
- Automatic sync on reconnect
- Local-first architecture

### Security

- Firebase Authentication
- Firestore Security Rules
- User-specific data isolation
- Secure API key management
