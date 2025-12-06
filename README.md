# TaskFlow AI

Ein persönlicher Task-Manager mit AI-Unterstützung - ähnlich wie "Cursor, aber für Tasks".

## ✨ Features

- **Fast Capture**: Schnelles Brain-Dump von Gedanken in den Chat
- **AI-Parsing**: Automatische Umwandlung von unstrukturierten Gedanken in saubere Tasks
- **Task Management**: Vollständige CRUD-Operationen für Tasks
- **Subtasks**: Hierarchische Task-Struktur mit Subtasks
- **Gruppen & Filter**: Tasks nach Gruppen filtern und organisieren
- **Dashboard**: Übersicht über erledigte Tasks (heute/diese Woche)
- **Dark Mode**: Unterstützung für helles, dunkles und System-Design
- **Mobile-First**: Responsive Design für Mac und Smartphone
- **Local Storage**: Persistente Speicherung im Browser (später Firebase)

## 🛠️ Tech Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling (mobile-first, responsive)
- **LocalStorage** für Persistenz (vorübergehend)

## 📁 Projektstruktur

```
src/
├── components/              # React-Komponenten
│   ├── TaskList.tsx         # Hauptliste aller Tasks mit Filtern
│   ├── TaskItem.tsx         # Einzelner Task mit Edit-Funktion
│   ├── Dashboard.tsx        # Statistik-Dashboard
│   ├── CreateTaskModal.tsx  # Modal zum Erstellen von Tasks
│   ├── ChatModal.tsx        # Modal für AI Chat
│   ├── SettingsModal.tsx    # Einstellungen (Dark Mode, Account)
│   └── SpeedDial.tsx        # Floating Action Button Menu
├── hooks/
│   ├── useTasks.ts          # Custom Hook für Task-Management
│   └── useTheme.ts          # Custom Hook für Dark Mode
├── types/
│   └── task.ts              # TypeScript-Definitionen
├── utils/
│   ├── taskUtils.ts         # Hilfsfunktionen für Tasks
│   └── aiParser.ts          # AI-Parser (simuliert, später echte AI)
├── App.tsx                  # Haupt-App-Komponente
├── main.tsx                 # Entry Point
└── index.css                # Tailwind CSS Imports
```

## 🚀 Installation

```bash
npm install
```

## 💻 Entwicklung

```bash
npm run dev
```

Die App läuft dann auf `http://localhost:5173`

## 📦 Build

```bash
npm run build
```

## 📋 Task Model

Jeder Task hat folgende Eigenschaften:

- `id`: Eindeutige ID
- `title`: Kurzer, klarer Titel
- `description`: Optionale längere Notizen
- `status`: `open` | `in_progress` | `done`
- `priority`: `low` | `medium` | `high` (optional)
- `group`: String wie "Work", "Personal", "Health" (für Filterung)
- `parentId`: Optional; wenn gesetzt, ist dies ein Subtask
- `createdAt`, `updatedAt`, `completedAt`: Timestamps
- `userId`: Besitzer des Tasks (für Multi-User-Support)

## 🎨 Design

- **Minimalistisches Design** mit matten Farben
- **Dark Mode** mit System-Erkennung
- **Mobile-First** Ansatz
- **Smooth Animations** und Transitions
- **Touch-optimiert** für Smartphones

## 🔜 Nächste Schritte

- [ ] Echte AI-Integration (OpenAI API oder ähnlich)
- [ ] Firebase-Integration für Sync
- [ ] Authentifizierung
- [ ] Erweiterte Features (Reminder, Planning, Collaboration)
- [ ] PWA-Support für Mobile-App-Erfahrung

## 📝 License

MIT
