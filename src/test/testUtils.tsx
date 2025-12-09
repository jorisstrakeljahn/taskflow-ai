/**
 * Test Utilities
 * Provides common test helpers and wrappers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ColorProvider } from '../contexts/ColorContext';

/**
 * All Providers Wrapper
 * Wraps components with all necessary context providers for testing
 */
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ColorProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ColorProvider>
  );
};

/**
 * Custom render function that includes all providers
 */
export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react';
