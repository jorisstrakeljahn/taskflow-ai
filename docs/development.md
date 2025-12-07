# Development Guide

Development setup, best practices, and workflow for TaskFlow AI.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase account (for production)

### Initial Setup

```bash
# Clone repository

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase config

# Start development server
npm run dev
```

## Development Workflow

### Before Starting Work

1. Pull latest changes: `git pull`
2. Install dependencies: `npm install`
3. Run checks: `npm run check`

### During Development

1. Start dev server: `npm run dev`
2. Make changes
3. Test in browser
4. Run checks: `npm run check`

### Before Committing

1. Run all checks: `npm run check`
2. Fix issues: `npm run check:fix`
3. Test build: `npm run build`
4. Commit changes

## Code Quality

### TypeScript

- Strict mode enabled
- No `any` types (warnings)
- Type safety throughout

### ESLint

- React Hooks rules
- No `console.log` (use logger utility)
- Unused variables warnings

### Prettier

- Automatic formatting
- Consistent code style
- Pre-commit hooks

See [code-quality.md](code-quality.md) for details.

## Project Structure

```
src/
├── components/        # React components
│   ├── auth/         # Authentication components
│   ├── modals/       # Modal dialogs
│   ├── settings/     # Settings sections
│   ├── tasks/        # Task-related components
│   └── ui/           # Reusable UI components
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── services/         # Firebase services
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Key Concepts

### Task Model

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  group: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  userId: string;
  order?: number;
}
```

### State Management

- **React Context**: Auth, Theme, Language, Color
- **Custom Hooks**: Task management, filters, modals
- **Firebase**: Real-time data synchronization

### Component Patterns

- **Container/Presentational**: Separation of logic and UI
- **Composition**: Reusable UI components
- **Custom Hooks**: Shared logic extraction

## Adding Features

### New Component

1. Create component file
2. Add TypeScript types
3. Add to appropriate directory
4. Export from index if needed
5. Add tests (if applicable)

### New Hook

1. Create hook file in `hooks/`
2. Follow naming: `use[FeatureName]`
3. Add TypeScript types
4. Document with JSDoc

### New Service

1. Create service file in `services/`
2. Export functions
3. Add error handling
4. Use logger utility

## Testing

### Manual Testing

1. Test on mobile and desktop
2. Test all user flows
3. Test error cases
4. Test offline behavior

### Build Testing

```bash
npm run build
npm run preview
```

## Deployment

### Firebase Hosting

```bash
# Build
npm run build

# Deploy
npm run deploy
```

See [firebase-setup.md](firebase-setup.md) for details.

## Troubleshooting

### Common Issues

**Build fails:**

- Check TypeScript errors: `npm run type-check`
- Check ESLint: `npm run lint`
- Clear node_modules: `rm -rf node_modules && npm install`

**Firebase errors:**

- Verify `.env` file exists
- Check Firebase Console
- Verify Security Rules

**Styling issues:**

- Clear browser cache
- Restart dev server
- Check Tailwind config

## Best Practices

1. **Type Safety**: Use TypeScript strictly
2. **Component Size**: Keep components small and focused
3. **Reusability**: Extract common patterns
4. **Error Handling**: Handle errors gracefully
5. **Performance**: Optimize renders with memo/useMemo
6. **Accessibility**: Follow WCAG guidelines
7. **Documentation**: Document complex logic
