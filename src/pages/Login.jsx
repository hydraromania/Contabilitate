import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, User, Briefcase, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState('contabil'); // 'client' or 'contabil'
  const [email, setEmail] = useState('office@hydraromania.ro');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Supabase Auth Error:", authError); // Added logging
        throw authError;
      }

      if (user) {
        console.log("User successfully logged in:", user); // Added logging
        // Fetch profile to determine role and redirect
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Supabase Profile Fetch Error:", profileError); // Added logging
          throw profileError;
        }

        console.log("User profile fetched:", profile); // Added logging

        // Logic: If they are on the "Client" tab but have an accountant role, or vice versa,
        // we still let them in but redirect to the correct dashboard.
        if (profile.role === 'admin' || profile.role === 'contabil_sef' || profile.role === 'contabil' || profile.role === 'jurist') {
          navigate('/backend');
        } else {
          navigate('/client');
        }
      }
    } catch (err) {
      console.error("Login process error:", err); // Added logging
      setError(err.message === 'Invalid login credentials' 
        ? 'Date de autentificare invalide. Vă rugăm să verificați email-ul și parola.' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    // Set default credentials for testing based on tab
    if (tab === 'contabil') {
      setEmail('office@hydraromania.ro');
      setPassword('123456');
    } else {
      setEmail('client@cosicomplus.ro');
      setPassword('testtest');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contabilitate Pro</h1>
          <p className="text-slate-500 mt-2">Sistem integrat de management financiar</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100/50 m-6 rounded-xl">
            <button
              onClick={() => handleTabChange('contabil')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === 'contabil'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Briefcase size={18} />
              Contabil
            </button>
            <button
              onClick={() => handleTabChange('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                activeTab === 'client'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User size={18} />
              Client
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {activeTab === 'contabil' ? 'Acces Personal' : 'Acces Client'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {activeTab === 'contabil' 
                  ? 'Introduceți datele pentru a accesa panoul de administrare.' 
                  : 'Accesați documentele și situația financiară a firmei dvs.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-danger p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3 animate-shake">
                  <div className="mt-0.5">⚠️</div>
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    placeholder="nume@exemplu.ro"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Parolă</label>
                  <button type="button" className="text-xs font-bold text-primary hover:underline">Ai uitat parola?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Se verifică...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Autentificare {activeTab === 'contabil' ? 'Staff' : 'Portal'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Hydra Romania. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </div>
  );
}
