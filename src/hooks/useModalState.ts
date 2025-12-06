import { useState, useCallback } from 'react';

/**
 * Custom hook to manage modal open/close state
 */
export const useModalState = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};

/**
 * Hook to manage multiple modals
 */
export const useModals = <T extends string>(modalNames: T[]) => {
  const modals = modalNames.reduce(
    (acc, name) => {
      acc[name] = useModalState();
      return acc;
    },
    {} as Record<T, ReturnType<typeof useModalState>>
  );

  return modals;
};

