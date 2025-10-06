import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string): string => {
  if (typeof window !== 'undefined') {
    // In browser, check for environment variables
    // @ts-ignore - Vite injects this
    return window.__VITE_ENV__?.[name] || fallback;
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://rdfclpbgvqgdnypcuzhr.supabase.co');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZmNzcGJndnFnZG55cGN1emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNzY0MTcsImV4cCI6MjA0Mzc1MjQxN30.YbwJxAQrB7vGVYLEBMmdPTGy-5B5WUpzGPV2RQWS_zo');

// Create client with public access options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Don't persist sessions for public access
    autoRefreshToken: false,
  },
});

// Database types
export interface WorkSession {
  id: string;
  user_id: string;
  task_name: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  daily_goal_hours: number;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export interface SharedReport {
  id: string;
  user_id: string;
  report_data: any;
  expires_at: string;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}