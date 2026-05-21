import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import buildTheme from '../theme';

export const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem('appThemeMode');
      return stored === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appThemeMode', mode);
    } catch (e) {}
  }, [mode]);

  // reflect mode on document body so global CSS (index.css) can adapt
  useEffect(() => {
    try {
      document.body.classList.toggle('dark-mode', mode === 'dark');
    } catch (e) {}
  }, [mode]);
  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
