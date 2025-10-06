import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import Timer from './components/Timer/Timer';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';
import Sidebar from './components/Layout/Sidebar';
import PublicReport from './components/Sharing/PublicReport';
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check if this is a public route
  const isPublicRoute = location.pathname.startsWith('/report/');

  useEffect(() => {
    // Skip auth check for public routes
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isPublicRoute]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Handle public routes
  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/report/:reportId" element={<PublicReport />} />
      </Routes>
    );
  }

  // Handle private routes
  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/timer" replace />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;