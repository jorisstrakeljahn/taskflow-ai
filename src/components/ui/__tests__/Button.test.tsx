/**
 * Unit Tests for Button Component
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/testUtils';
import { Button } from '../Button';

// Mock useAccentColor hook
vi.mock('../../hooks/useAccentColor', () => ({
  useAccentColor: () => ({
    accentColor: '#3b82f6',
  }),
}));

describe('Button', () => {
  it('should render button with text', () => {
    renderWithProviders(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Disabled Button</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply variant classes', () => {
    renderWithProviders(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-white');

    renderWithProviders(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button', { name: /danger/i })).toHaveClass('text-red-600');
  });

  it('should apply fullWidth class when fullWidth is true', () => {
    renderWithProviders(<Button fullWidth>Full Width</Button>);

    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
