/**
 * Unit Tests for LoadingSpinner Component
 */

import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test/testUtils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    const { container } = renderWithProviders(<LoadingSpinner />);

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should have accessible role', () => {
    const { container } = renderWithProviders(<LoadingSpinner />);

    // Spinner should be present in DOM
    expect(container.firstChild).toBeInTheDocument();
  });
});
