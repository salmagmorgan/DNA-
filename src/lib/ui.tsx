import { createContext, useContext, type ReactNode } from 'react';

export interface UiApi {
  openDrawer: (title: ReactNode, body: ReactNode) => void;
  closeDrawer: () => void;
  openSearch: () => void;
  openNotes: () => void;
}

export const UiContext = createContext<UiApi | null>(null);

export function useUi(): UiApi {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used inside <UiContext.Provider>');
  return ctx;
}
