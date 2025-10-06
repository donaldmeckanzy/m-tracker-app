-- M-Tracker Database Schema
-- Run this in your Supabase SQL editor

-- Work Sessions table
CREATE TABLE IF NOT EXISTS work_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  task_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_goal_hours INTEGER DEFAULT 6 CHECK (daily_goal_hours > 0 AND daily_goal_hours <= 24),
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT true,
    export_format VARCHAR(10) DEFAULT 'json' CHECK (export_format IN ('json', 'csv')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create shared reports table for accountability sharing
CREATE TABLE shared_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS work_sessions_user_id_idx ON work_sessions(user_id);
CREATE INDEX IF NOT EXISTS work_sessions_start_time_idx ON work_sessions(start_time);
CREATE INDEX IF NOT EXISTS work_sessions_created_at_idx ON work_sessions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for work_sessions
CREATE POLICY "Users can view their own sessions" ON work_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON work_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON work_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON work_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_work_sessions_updated_at BEFORE UPDATE
  ON work_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE
  ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on shared_reports
ALTER TABLE shared_reports ENABLE ROW LEVEL SECURITY;

-- Shared reports policies
CREATE POLICY "Users can view own shared reports" ON shared_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shared reports" ON shared_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shared reports" ON shared_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shared reports" ON shared_reports
    FOR DELETE USING (auth.uid() = user_id);

-- Public policy for viewing active, non-expired shared reports
CREATE POLICY "Anyone can view active shared reports" ON shared_reports
    FOR SELECT USING (
        is_active = true 
        AND expires_at > NOW()
    );

-- Create trigger for shared_reports updated_at
CREATE TRIGGER update_shared_reports_updated_at BEFORE UPDATE
  ON shared_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for shared_reports
CREATE INDEX IF NOT EXISTS shared_reports_user_id_idx ON shared_reports(user_id);
CREATE INDEX IF NOT EXISTS shared_reports_expires_at_idx ON shared_reports(expires_at);
CREATE INDEX IF NOT EXISTS shared_reports_is_active_idx ON shared_reports(is_active);