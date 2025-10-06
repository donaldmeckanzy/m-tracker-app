import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';
import { LogOut, Download, Save, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, isLoading, saveSettings, isSaving } = useSettings();
  const [dailyGoal, setDailyGoal] = useState(6);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize form values when settings load
  useEffect(() => {
    if (settings) {
      setDailyGoal(settings.daily_goal_hours);
      setTheme(settings.theme);
      setHasUnsavedChanges(false);
    }
  }, [settings]);

  // Track changes
  useEffect(() => {
    if (settings) {
      const hasChanges = 
        dailyGoal !== settings.daily_goal_hours || 
        theme !== settings.theme;
      setHasUnsavedChanges(hasChanges);
    }
  }, [dailyGoal, theme, settings]);

  const handleSaveSettings = async () => {
    try {
      await saveSettings({
        daily_goal_hours: dailyGoal,
        theme: theme,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSignOutLoading(false);
    }
  };

  const handleExport = () => {
    // Placeholder for export functionality
    alert('Export functionality coming soon!');
  };

  return (
    <div className="h-full p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>
        
        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">General</h3>
            
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading settings...</div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="daily-goal" className="block text-sm font-medium text-foreground mb-2">
                      Daily Goal (hours)
                    </label>
                    <input
                      id="daily-goal"
                      type="number"
                      min="1"
                      max="24"
                      value={dailyGoal}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1 && value <= 24) {
                          setDailyGoal(value);
                        }
                      }}
                      className="w-32 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be between 1 and 24 hours
                    </p>
                  </div>

                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-foreground mb-2">
                      Theme
                    </label>
                    <select
                      id="theme"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                      className="w-40 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                {hasUnsavedChanges && (
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="w-full sm:w-auto"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      You have unsaved changes
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
            
            <div className="space-y-4">
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Account */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
            
            <Button
              onClick={handleSignOut}
              variant="destructive"
              disabled={signOutLoading}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {signOutLoading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;