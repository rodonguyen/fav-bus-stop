import './App.css';
import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import Auth from './Auth';
import Dashboard from './Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <ThemeProvider>
      <div>
        {!session ? <Auth /> : <Dashboard />}
      </div>
    </ThemeProvider>
  );
}

export default App; 