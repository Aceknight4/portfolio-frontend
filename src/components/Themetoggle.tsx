import React, { useEffect, useState } from 'react';
import './Themetoggle.css';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'bp-theme';

function getInitialTheme(): Theme {
  // 1. Respect a previous manual choice, if there is one
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // 2. Otherwise fall back to the visitor's OS-level preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Whenever theme changes, reflect it on <html> and remember it
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="bp-theme-toggle"
      onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
};

export default ThemeToggle;