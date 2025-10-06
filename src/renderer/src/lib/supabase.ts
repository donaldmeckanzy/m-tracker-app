import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdfclpbgvqgdnypcuzhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZmNscGJndnFnZG55cGN1emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNzY0MTcsImV4cCI6MjA0Mzc1MjQxN30.YbwJxAQrB7vGVYLEBMmdPTGy-5B5WUpzGPV2RQWS_zo';

export const supabase = createClient(supabaseUrl, supabaseKey);

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