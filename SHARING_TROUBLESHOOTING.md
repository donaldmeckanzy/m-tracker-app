# 🔧 Sharing Feature Troubleshooting Guide

## Error: "Failed to generate shareable report. Please try again."

This error occurs when trying to create a shareable report. Follow these steps to diagnose and fix:

### Step 1: Check Database Setup ⚠️ **MOST COMMON ISSUE**

The sharing feature requires a new database table. If you haven't updated your Supabase database:

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to "SQL Editor"

2. **Run Database Setup**
   - Copy the SQL from `DATABASE_SHARING_SETUP.md`
   - Paste and execute in SQL Editor
   - Verify the `shared_reports` table was created

3. **Test Database Connection**
   - Open M-Tracker Dashboard
   - Look for the yellow "Sharing Debug Panel"
   - Click "Test Database Connection"
   - Should show ✅ "Database connection and shared_reports table working!"

### Step 2: Check Authentication

1. **Verify Login Status**
   - Make sure you're logged into M-Tracker
   - Check the debug panel shows your sessions

2. **Re-authenticate if needed**
   - Log out and log back in
   - Try generating report again

### Step 3: Check Work Sessions

1. **Verify Session Data**
   - Debug panel should show "Today's Sessions: [number > 0]"
   - Make sure you have tracked some work today

2. **Track Work if Empty**
   - Go to Timer tab
   - Start and stop a work session
   - Return to Dashboard and try again

### Step 4: Browser Console Debugging

1. **Open Developer Tools**
   - Right-click → "Inspect" → "Console" tab
   - Clear console (trash icon)

2. **Try Generating Report**
   - Click "Generate Shareable Link"
   - Watch console for detailed error messages

3. **Common Console Errors:**

   **"relation 'shared_reports' does not exist"**
   - ❌ Database table not created
   - ✅ Solution: Run database setup SQL

   **"permission denied for table shared_reports"**
   - ❌ Row Level Security policies not set
   - ✅ Solution: Run the RLS policies from setup SQL

   **"Not authenticated"**
   - ❌ User not logged in properly
   - ✅ Solution: Log out and log back in

   **"User not authenticated"**
   - ❌ Session expired
   - ✅ Solution: Refresh page and log in again

### Step 5: Network Issues

1. **Check Internet Connection**
   - Ensure stable internet connection
   - Try refreshing the page

2. **Supabase Service Status**
   - Check if Supabase services are online
   - Visit Supabase status page if needed

### Step 6: Data Validation

The system validates that you have actual work data:

1. **Minimum Requirements:**
   - At least 1 work session for the selected date
   - Total time > 0 seconds
   - Valid task names

2. **If no sessions:**
   - Error: "No work sessions found for this date"
   - Solution: Track some work first

### Step 7: Browser Compatibility

1. **Supported Browsers:**
   - Chrome 80+
   - Firefox 74+
   - Safari 13+
   - Edge 80+

2. **Known Issues:**
   - Some ad blockers may interfere
   - Private/incognito mode may have restrictions

## Debug Information Collection

If the issue persists, collect this information:

### From Debug Panel:
- Sessions Loading: [Yes/No]
- Total Sessions: [number]
- Today's Sessions: [number]
- Reports Loading: [Yes/No]
- Existing Reports: [number]

### From Browser Console:
- Any error messages when clicking "Generate Shareable Link"
- Network errors in Network tab

### From Database Test:
- Result of "Test Database Connection" button

## Quick Fixes

### 99% of cases: Database Setup
```sql
-- Run this in Supabase SQL Editor
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

ALTER TABLE shared_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own shared reports" ON shared_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active shared reports" ON shared_reports
    FOR SELECT USING (is_active = true AND expires_at > NOW());
```

### Other Quick Fixes:
1. **Refresh Page**: Often resolves temporary issues
2. **Clear Browser Cache**: Remove old cached data
3. **Try Different Date**: Use a date with existing work sessions
4. **Restart App**: Close and reopen M-Tracker

## Success Indicators

When working correctly, you should see:
1. ✅ Debug panel shows your sessions
2. ✅ "Test Database Connection" succeeds
3. ✅ Console shows "Report created successfully"
4. ✅ Shareable URL appears in green box
5. ✅ Copy/Preview buttons work

The sharing feature is now properly debugged and should work reliably once the database is set up correctly!