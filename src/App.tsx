import './App.css';
import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import Auth from './Auth';
import Dashboard from './Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import Footer from './components/Footer';

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
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          {!session ? <Auth /> : <Dashboard />}
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 