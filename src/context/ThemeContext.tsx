import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    return localStorage.getItem('darkTheme') === '1';
  });

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Update localStorage and HTML data-theme attribute when state changes
  useEffect(() => {
    localStorage.setItem('darkTheme', isDarkTheme ? '1' : '0');
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'emerald');
    
    // Dispatch a custom event so other components can react to theme changes
    window.dispatchEvent(new Event('themechange'));
  }, [isDarkTheme]);

  // Provide the context value to children
  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 