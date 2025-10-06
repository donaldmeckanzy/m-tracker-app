import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface UserPreferences {
  user_id: string;
  daily_goal_hours: number;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export const useSettings = () => {
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Return default settings if none exist
      return data || {
        user_id: user.id,
        daily_goal_hours: 6,
        theme: 'system' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserPreferences>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });

  const saveSettings = (newSettings: Partial<UserPreferences>) => {
    return saveSettingsMutation.mutateAsync(newSettings);
  };

  return {
    settings,
    isLoading,
    saveSettings,
    isSaving: saveSettingsMutation.isPending,
    error: saveSettingsMutation.error,
  };
};