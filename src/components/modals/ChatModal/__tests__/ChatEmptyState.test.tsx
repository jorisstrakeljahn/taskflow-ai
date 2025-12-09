/**
 * Unit Tests for ChatEmptyState Component
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/testUtils';
import { ChatEmptyState } from '../ChatEmptyState';

describe('ChatEmptyState', () => {
  it('should render empty state message', () => {
    renderWithProviders(<ChatEmptyState />);

    // Should render without errors - check for structure
    const container = screen.getByText(/Share your thoughts|Teile deine Gedanken/i);
    expect(container).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = renderWithProviders(<ChatEmptyState />);

    expect(container.querySelector('.flex.items-center.justify-center')).toBeInTheDocument();
  });
});
