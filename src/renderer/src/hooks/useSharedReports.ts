import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, SharedReport } from '../lib/supabase';

export const useSharedReports = () => {
  const queryClient = useQueryClient();

  // Fetch user's shared reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['shared-reports'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shared_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SharedReport[];
    },
  });

  // Create shared report mutation
  const createReportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      console.log('Creating shared report with data:', reportData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        throw new Error('Not authenticated');
      }

      console.log('User authenticated:', user.id);

      const insertData = {
        user_id: user.id,
        report_data: reportData.report_data,
        expires_at: reportData.expires_at,
        is_active: true,
      };

      console.log('Inserting data:', insertData);

      const { data, error } = await supabase
        .from('shared_reports')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Report created successfully:', data);
      return data as SharedReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-reports'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });

  // Update shared report mutation
  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, updates }: { reportId: string; updates: Partial<SharedReport> }) => {
      const { data, error } = await supabase
        .from('shared_reports')
        .update(updates)
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      return data as SharedReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-reports'] });
    },
  });

  // Delete shared report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('shared_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-reports'] });
    },
  });

  const createReport = (reportData: any) => {
    return createReportMutation.mutateAsync(reportData);
  };

  const updateReport = (reportId: string, updates: Partial<SharedReport>) => {
    return updateReportMutation.mutateAsync({ reportId, updates });
  };

  const deleteReport = (reportId: string) => {
    return deleteReportMutation.mutateAsync(reportId);
  };

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    isCreating: createReportMutation.isPending,
    isUpdating: updateReportMutation.isPending,
    isDeleting: deleteReportMutation.isPending,
  };
};

// Hook for fetching public reports (no auth required)
export const usePublicReport = (reportId: string) => {
  return useQuery({
    queryKey: ['public-report', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_reports')
        .select('report_data, expires_at, is_active')
        .eq('id', reportId)
        .single();

      if (error) throw error;

      // Check if report is still active and not expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (!data.is_active || now > expiresAt) {
        throw new Error('This report has expired or is no longer available');
      }

      // Increment view count (fire and forget)
      // Note: This is a simple increment - for production you'd want a proper RPC function
      const currentViewCount = await supabase
        .from('shared_reports')
        .select('view_count')
        .eq('id', reportId)
        .single();

      if (currentViewCount.data) {
        supabase
          .from('shared_reports')
          .update({ view_count: (currentViewCount.data.view_count || 0) + 1 })
          .eq('id', reportId)
          .then(() => {
            // View count updated
          });
      }

      return data.report_data;
    },
    enabled: !!reportId,
  });
};