# TaskFlow AI

A personal task manager with AI support - similar to "Cursor, but for tasks".

## ✨ Features

- **Fast Capture**: Quick brain-dump of thoughts into chat
- **AI Parsing**: Automatic conversion of unstructured thoughts into clean tasks
- **Task Management**: Full CRUD operations for tasks
- **Subtasks**: Hierarchical task structure with subtasks
- **Groups & Filters**: Filter and organize tasks by groups
- **Dashboard**: Overview of completed tasks (today/this week)
- **Dark Mode**: Support for light, dark, and system design
- **Mobile-First**: Responsive design for Mac and smartphone
- **Local Storage**: Persistent storage in browser (later Firebase)

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling (mobile-first, responsive)
- **LocalStorage** for persistence (temporary)

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── TaskList.tsx         # Main list of all tasks with filters
│   ├── TaskItem.tsx         # Individual task with edit function
│   ├── Dashboard.tsx        # Statistics dashboard
│   ├── CreateTaskModal.tsx  # Modal for creating tasks
│   ├── ChatModal.tsx        # Modal for AI chat
│   ├── SettingsModal.tsx    # Settings (Dark Mode, Account)
│   └── SpeedDial.tsx        # Floating Action Button menu
├── hooks/
│   ├── useTasks.ts          # Custom hook for task management
│   └── useTheme.ts          # Custom hook for dark mode
├── types/
│   └── task.ts              # TypeScript definitions
├── utils/
│   ├── taskUtils.ts         # Helper functions for tasks
│   └── aiParser.ts          # AI parser (simulated, later real AI)
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Tailwind CSS imports
```

## 🚀 Installation

```bash
npm install
```

## 💻 Development

```bash
npm run dev
```

The app runs on `http://localhost:5173`

## 📦 Build

```bash
npm run build
```

## 📋 Task Model

Each task has the following properties:

- `id`: Unique ID
- `title`: Short, clear title
- `description`: Optional longer notes
- `status`: `open` | `in_progress` | `done`
- `priority`: `low` | `medium` | `high` (optional)
- `group`: String like "Work", "Personal", "Health" (for filtering)
- `parentId`: Optional; if set, this is a subtask
- `createdAt`, `updatedAt`, `completedAt`: Timestamps
- `userId`: Task owner (for multi-user support)

## 🎨 Design

- **Minimalist design** with matte colors
- **Dark Mode** with system detection
- **Mobile-First** approach
- **Smooth animations** and transitions
- **Touch-optimized** for smartphones

## 🔜 Next Steps

- [ ] Real AI integration (OpenAI API or similar)
- [ ] Firebase integration for sync
- [ ] Authentication
- [ ] Extended features (reminders, planning, collaboration)
- [ ] PWA support for mobile app experience

## 📝 License

MIT
