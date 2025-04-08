import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/' }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/dashboard' }) => {
  const { session } = useAuth();
  if (session) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isLoading: isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <></>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
              <AppRoutes />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
