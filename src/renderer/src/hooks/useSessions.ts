import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, WorkSession } from '../lib/supabase';

export const useSessions = () => {
  const queryClient = useQueryClient();

  // Fetch sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['work-sessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WorkSession[];
    },
  });

  // Save session mutation
  const saveSessionMutation = useMutation({
    mutationFn: async (session: Omit<WorkSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('work_sessions')
        .insert({
          ...session,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as WorkSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-sessions'] });
    },
  });

  // Update session mutation for resuming existing sessions
  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: Partial<WorkSession> }) => {
      const { data, error } = await supabase
        .from('work_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data as WorkSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-sessions'] });
    },
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('work_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-sessions'] });
    },
  });

  const saveSession = (session: Omit<WorkSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return saveSessionMutation.mutateAsync(session);
  };

  const updateSession = (sessionId: string, updates: Partial<WorkSession>) => {
    return updateSessionMutation.mutateAsync({ sessionId, updates });
  };

  const deleteSession = (sessionId: string) => {
    return deleteSessionMutation.mutateAsync(sessionId);
  };

  // Calculate today's total time
  const todayTotal = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time).toDateString();
      const today = new Date().toDateString();
      return sessionDate === today;
    })
    .reduce((total, session) => total + (session.duration_seconds || 0), 0);

  // Calculate this week's total time
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekTotal = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= weekStart;
    })
    .reduce((total, session) => total + (session.duration_seconds || 0), 0);

  return {
    sessions,
    isLoading,
    saveSession,
    updateSession,
    deleteSession,
    isSaving: saveSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    todayTotal,
    weekTotal,
  };
};