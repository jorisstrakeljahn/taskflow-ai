# TaskFlow AI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6-orange.svg)](https://firebase.google.com/)

> A modern, AI-powered task management application with real-time synchronization across devices.

TaskFlow AI is a personal task manager that combines the simplicity of a to-do list with the power of AI. Dump your thoughts into a chat interface, and watch them transform into structured, actionable tasks.

## ✨ Features

- **🤖 AI-Powered Task Creation**: Convert unstructured thoughts into clean, organized tasks using OpenAI GPT-4o-mini
- **📋 Full Task Management**: Create, edit, delete, and organize tasks with full CRUD operations
- **🌳 Subtask Support**: Hierarchical task structure with unlimited nesting
- **🏷️ Smart Organization**: Group tasks by category
- **🔍 Advanced Filtering**: Filter by status, priority, and group
- **🌓 Dark Mode**: Light, dark, and system theme support
- **🎨 Customizable**: Choose from 10+ accent colors
- **🌍 Internationalization**: English and German support
- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **⚡ Real-Time Sync**: Firebase-powered synchronization across devices
- **🔄 Drag & Drop**: Intuitive task reordering

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/jorisstrakeljahn/taskflow-ai
cd taskflow-ai

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env and add your Firebase configuration
# See docs/firebase-setup.md for detailed instructions
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
npm run deploy
```

## 📁 Project Structure

```
taskflow-ai/
├── .github/                   # GitHub configuration
│   ├── workflows/            # CI/CD workflows
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                      # Documentation
│   ├── accessibility.md      # Accessibility features
│   ├── ai-integration.md     # AI integration guide
│   ├── api.md                # API documentation
│   ├── code-quality.md       # Code quality guidelines
│   ├── development.md        # Development guide
│   ├── features.md           # Feature documentation
│   ├── firebase-setup.md     # Firebase setup
│   ├── security.md           # Security documentation
│   └── testing.md           # Testing guide
├── src/
│   ├── components/           # React components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── locales/            # i18n translations
├── .env.example              # Environment variables template
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── CHANGELOG.md            # Version history
└── package.json
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Firebase Setup](docs/firebase-setup.md)** - Complete Firebase configuration guide
- **[AI Integration](docs/ai-integration.md)** - OpenAI integration and configuration
- **[Features](docs/features.md)** - Detailed feature documentation
- **[Development](docs/development.md)** - Development guide and best practices
- **[Code Quality](docs/code-quality.md)** - ESLint, Prettier, and guidelines
- **[Testing](docs/testing.md)** - Testing setup and best practices
- **[API Documentation](docs/api.md)** - API reference for hooks, services, and types
- **[Accessibility](docs/accessibility.md)** - Accessibility features and keyboard shortcuts
- **[Security](docs/security.md)** - Security measures, input validation, and best practices

## 🔧 Available Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Start development server                    |
| `npm run build`      | Build for production                        |
| `npm run lint`       | Run ESLint                                  |
| `npm run lint:fix`   | Fix ESLint errors automatically             |
| `npm run format`     | Format code with Prettier                   |
| `npm run type-check` | Run TypeScript type checking                |
| `npm run check`      | Run all checks (type-check + lint + format) |
| `npm run deploy`     | Build and deploy to Firebase Hosting        |

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Firebase** - Backend (Auth, Firestore, Hosting)
- **OpenAI API** - AI-powered task generation
- **Lucide React** - Icons

## 📊 Project Status

- ✅ Core features implemented
- ✅ Comprehensive test coverage
- ✅ Full documentation
- ✅ Security measures in place
- ✅ Accessibility compliant
- 🚧 Additional features in development

## 🔐 Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration (for AI task generation)
VITE_OPENAI_API_KEY=your_openai_api_key
```

**Built with ❤️ using React, TypeScript, and Firebase**
