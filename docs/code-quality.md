# Code Quality Tools

Tools and guidelines for maintaining code quality in TaskFlow AI.

## Available Tools

### ESLint - Code Linting

Finds and fixes code problems, bad practices, and potential bugs.

```bash
# Run linter
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

### Prettier - Code Formatting

Ensures consistent code formatting across the project.

```bash
# Format code
npm run format

# Check formatting (without changes)
npm run format:check
```

### TypeScript - Type Checking

Checks TypeScript types for errors.

```bash
# Check TypeScript (without build)
npm run type-check
```

### All-in-One Checks

Runs all checks at once.

```bash
# Run all checks (TypeScript + ESLint + Prettier)
npm run check

# Run all checks and auto-fix
npm run check:fix
```

## Pre-Commit Hooks

**Husky** and **lint-staged** ensure code is automatically checked and formatted before committing.

### What happens on commit?

1. **Auto-formatting**: Changed files are formatted with Prettier
2. **Auto-linting**: ESLint fixes auto-fixable issues
3. **Commit blocked**: If there are unfixable errors, commit is aborted

### Manual pre-commit check

```bash
# Before commit: Run all checks
npm run check

# Or auto-fix
npm run check:fix
```

## Workflow

### Before each commit:

```bash
npm run check
```

### If errors found:

```bash
npm run check:fix
```

### Before push:

```bash
npm run check
npm run build  # Optional: Test build
```

## Configuration

- **ESLint**: `.eslintrc.cjs`
- **Prettier**: `.prettierrc.json`
- **lint-staged**: `.lintstagedrc.json`
- **Husky**: `.husky/pre-commit`

## Rules

### ESLint Rules:

- TypeScript strict mode
- React Hooks rules
- No `console.log` (use logger utility)
- No `any` types (warnings)
- Unused variables shown as warnings

### Prettier Rules:

- Single quotes
- Semicolons
- 100 characters per line
- 2 spaces indentation

## Troubleshooting

### Pre-commit hook not working

```bash
# Reinitialize Husky
npx husky install
```

### Too many linting errors

```bash
# Auto-fix
npm run lint:fix
npm run format
```

### TypeScript errors

```bash
# Check TypeScript
npm run type-check
```

## Best Practices

1. **Before each commit**: Run `npm run check`
2. **If errors**: Use `npm run check:fix`
3. **Before push**: Run `npm run check && npm run build`
4. **Regularly**: Run `npm run lint` and `npm run format:check`
