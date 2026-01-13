import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import BackendLayout from './components/BackendLayout';
import Dashboard from './pages/backend/Dashboard';
import Clients from './pages/backend/Clients';
import Settings from './pages/backend/Settings';
import ClientDashboard from './pages/frontend/ClientDashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/backend" />} />
        
        {/* Backend Routes */}
        <Route path="/backend" element={session ? <BackendLayout profile={profile} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard profile={profile} />} />
          <Route path="clients" element={<Clients profile={profile} />} />
          <Route path="settings" element={<Settings profile={profile} />} />
        </Route>

        {/* Frontend Routes */}
        <Route path="/client" element={session ? <ClientDashboard /> : <Navigate to="/login" />} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
