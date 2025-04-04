import './App.css';
import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import Auth from './Auth';
import Dashboard from './Dashboard';

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
    <div>
      {!session ? <Auth /> : <Dashboard />}
    </div>
  );
}

export default App; 