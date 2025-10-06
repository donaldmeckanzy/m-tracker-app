# Database Setup Guide

## ⚠️ IMPORTANT: You must run this SQL script in Supabase to enable all features

Before using the M-Tracker app, you need to set up the database tables in your Supabase project.

## Steps to Setup Database:

### 1. Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Copy and Run the Schema
Copy the entire content from `database-schema.sql` and paste it into the SQL editor, then click **Run**.

The schema will create:
- `work_sessions` table for storing timer sessions
- `user_preferences` table for user settings
- Proper indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp triggers

### 3. Verify Setup
After running the script, you should see:
- Two new tables in your database
- Proper security policies applied
- No errors in the SQL editor

## What Each Table Does:

### `work_sessions`
Stores all your timed work sessions with:
- Task name and duration
- Start and end timestamps  
- User association
- Optional notes and tags

### `user_preferences`
Stores your app settings:
- Daily goal hours
- Theme preference (light/dark/system)
- User-specific preferences

## Security Features:
- **Row Level Security**: Users can only see their own data
- **Authentication Required**: All operations require valid user session
- **Data Isolation**: Complete separation between different users

## Database Schema File Location:
The complete SQL schema is in: `/database-schema.sql`

---

**✅ Once you've run this schema, all features will work:**
- ✅ Sessions will save when you stop the timer
- ✅ Dashboard will display real data
- ✅ Settings will persist between sessions
- ✅ Recent sessions will appear in the dashboard