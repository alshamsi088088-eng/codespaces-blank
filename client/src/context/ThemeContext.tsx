
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { ThemeMode } from '../types';

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'dark', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sura-theme') : null;
    return (saved as ThemeMode) || 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('light', mode === 'light');
    localStorage.setItem('sura-theme', mode);
  }, [mode]);

  const toggle = () => setMode((current) => (current === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
