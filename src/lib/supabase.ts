import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'contabil_sef' | 'contabil' | 'jurist';
  avatar_url?: string;
};

export type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  cui: string;
  address: string;
  city: string;
  county: string;
  phone: string;
  role: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
};
