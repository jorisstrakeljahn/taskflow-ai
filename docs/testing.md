# Testing Guide

## Overview

TaskFlow AI uses **Vitest** as the test runner, combined with **React Testing Library** for component testing. This setup provides fast, reliable tests with excellent TypeScript support.

## Test Setup

### Dependencies

- **vitest**: Fast, Vite-native test runner
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: DOM matchers for assertions
- **@testing-library/user-event**: User interaction simulation
- **@vitest/coverage-v8**: Code coverage reporting
- **@vitest/ui**: Interactive test UI
- **jsdom**: DOM environment for tests

### Configuration

- **vitest.config.ts**: Main test configuration
- **src/test/setup.ts**: Global test setup and mocks
- **src/test/testUtils.tsx**: Test utilities and helpers

## Running Tests

### Basic Commands

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/index.html` (open in browser)
- **LCOV Report**: `coverage/lcov.info` (for CI/CD)
- **JSON Report**: `coverage/coverage-final.json`

### Coverage Thresholds

The project aims for:

- **Lines**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Statements**: 80%

## Writing Tests

### Test File Structure

Tests should be placed in `__tests__` directories next to the code they test:

```
src/
├── utils/
│   ├── taskUtils.ts
│   └── __tests__/
│       └── taskUtils.test.ts
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx
```

### Example: Utility Function Test

```typescript
import { describe, it, expect } from 'vitest';
import { createTask } from '../taskUtils';

describe('createTask', () => {
  it('should create a task with required fields', () => {
    const task = createTask('Test Task', 'user-123');

    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('open');
    expect(task.id).toBeDefined();
  });
});
```

### Example: Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/testUtils'
import { Button } from '../Button'

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Example: Hook Test

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskFilters } from '../useTaskFilters';

describe('useTaskFilters', () => {
  it('should filter tasks by group', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));

    act(() => {
      result.current.setFilterGroup('Work');
    });

    expect(result.current.filteredTasks.every((t) => t.group === 'Work')).toBe(true);
  });
});
```

## Test Utilities

### `renderWithProviders`

Wraps components with all necessary context providers:

```typescript
import { renderWithProviders } from '../../test/testUtils'

renderWithProviders(<MyComponent />)
```

### Mocking

Common mocks are set up in `src/test/setup.ts`:

- `localStorage`
- `window.matchMedia`
- `ResizeObserver`
- `IntersectionObserver`

## Best Practices

### 1. Test Behavior, Not Implementation

✅ Good:

```typescript
it('should disable button when loading', () => {
  renderWithProviders(<Button disabled>Submit</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})
```

❌ Bad:

```typescript
it('should have disabled prop', () => {
  // Testing implementation details
});
```

### 2. Use Accessible Queries

Prefer queries that reflect how users interact:

1. `getByRole` - Most accessible
2. `getByLabelText` - Forms
3. `getByText` - Fallback
4. `getByTestId` - Last resort

### 3. Test User Interactions

Use `@testing-library/user-event` for realistic interactions:

```typescript
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');
```

### 4. Keep Tests Focused

Each test should verify one behavior:

```typescript
// ✅ Good: One assertion per test
it('should filter by group', () => { ... })
it('should filter by status', () => { ... })

// ❌ Bad: Multiple behaviors in one test
it('should filter and sort and reset', () => { ... })
```

### 5. Use Descriptive Test Names

Test names should clearly describe what is being tested:

```typescript
// ✅ Good
it('should return empty array when no tasks match group', () => { ... })

// ❌ Bad
it('works', () => { ... })
```

## Coverage

### Current Coverage

Run `npm run test:coverage` to see current coverage:

- **Utils**: ~70% (good coverage)
- **Hooks**: ~15% (needs improvement)
- **Components**: ~10% (needs improvement)
- **Services**: 0% (needs tests)

### Improving Coverage

1. Start with critical paths (utilities, hooks)
2. Add component tests for complex components
3. Add integration tests for user flows
4. Mock external dependencies (Firebase, OpenAI)

## CI/CD Integration

Tests run automatically in CI/CD pipelines:

```yaml
# Example GitHub Actions
- run: npm run test:run
- run: npm run test:coverage
```

## Troubleshooting

### Tests fail with "localStorage is not defined"

This is handled in `src/test/setup.ts`. If issues persist, check the mock implementation.

### Tests fail with "useLanguage must be used within LanguageProvider"

Use `renderWithProviders` instead of `render`:

```typescript
import { renderWithProviders } from '../../test/testUtils'
renderWithProviders(<Component />)
```

### Coverage not generating

Ensure `@vitest/coverage-v8` is installed and `coverage.provider` is set to `'v8'` in `vitest.config.ts`.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
