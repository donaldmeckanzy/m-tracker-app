-- M-Tracker Database Setup for Sharing Reports
-- Run this in your Supabase SQL Editor

-- First, check if shared_reports table exists, if not create it
CREATE TABLE IF NOT EXISTS shared_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on shared_reports
ALTER TABLE shared_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own shared reports" ON shared_reports;
DROP POLICY IF EXISTS "Users can create own shared reports" ON shared_reports;
DROP POLICY IF EXISTS "Users can update own shared reports" ON shared_reports;
DROP POLICY IF EXISTS "Users can delete own shared reports" ON shared_reports;
DROP POLICY IF EXISTS "Anyone can view active shared reports" ON shared_reports;

-- Create fresh policies
CREATE POLICY "Users can view own shared reports" ON shared_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shared reports" ON shared_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shared reports" ON shared_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shared reports" ON shared_reports
    FOR DELETE USING (auth.uid() = user_id);

-- CRITICAL: Public policy for viewing shared reports (no auth required)
CREATE POLICY "Anyone can view active shared reports" ON shared_reports
    FOR SELECT USING (
        is_active = true 
        AND expires_at > NOW()
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS shared_reports_user_id_idx ON shared_reports(user_id);
CREATE INDEX IF NOT EXISTS shared_reports_expires_at_idx ON shared_reports(expires_at);
CREATE INDEX IF NOT EXISTS shared_reports_is_active_idx ON shared_reports(is_active);

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_shared_reports_updated_at ON shared_reports;
CREATE TRIGGER update_shared_reports_updated_at BEFORE UPDATE
  ON shared_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Test the setup by checking if we can query the table
SELECT 'shared_reports table setup complete' as status;