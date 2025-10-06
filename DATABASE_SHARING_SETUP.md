# Database Setup Instructions for Sharing Feature

## Important: Update Your Database Schema

The sharing feature requires a new table `shared_reports` to be added to your Supabase database. Follow these steps:

### 1. Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New query"

### 2. Run the Following SQL Commands

Copy and paste this SQL into the editor and run it:

```sql
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
```

### 3. Verify the Table was Created
After running the SQL, verify the table exists:
1. Go to "Table Editor" in Supabase
2. Look for "shared_reports" in the tables list
3. You should see the table with all the columns

### 4. Check Row Level Security
1. In Table Editor, click on "shared_reports"
2. Go to "Settings" tab
3. Verify "Enable RLS" is turned ON
4. Check that policies are listed under "Policies" tab

## Troubleshooting

If you get errors:
- Make sure you're connected to the correct database
- Ensure you have sufficient permissions
- Try running the commands one by one if there are issues

Once this is completed, the sharing feature should work correctly!