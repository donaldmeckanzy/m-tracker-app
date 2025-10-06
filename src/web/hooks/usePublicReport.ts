import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Hook for fetching public reports (no auth required)
export const usePublicReport = (reportId: string) => {
  return useQuery({
    queryKey: ['public-report', reportId],
    queryFn: async () => {
      console.log('Fetching public report:', reportId);
      
      const { data, error } = await supabase
        .from('shared_reports')
        .select('report_data, expires_at, is_active, view_count')
        .eq('id', reportId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Report not found: ${error.message}`);
      }

      console.log('Report data:', data);

      // Check if report is still active and not expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      console.log('Current time:', now);
      console.log('Expires at:', expiresAt);
      console.log('Is active:', data.is_active);
      
      if (!data.is_active) {
        throw new Error('This report has been deactivated');
      }
      
      if (now > expiresAt) {
        throw new Error('This report has expired');
      }

      // Increment view count (fire and forget)
      supabase
        .from('shared_reports')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', reportId)
        .then((result) => {
          if (result.error) {
            console.warn('Could not update view count:', result.error);
          } else {
            console.log('View count updated');
          }
        });

      return data.report_data;
    },
    enabled: !!reportId,
    retry: 1, // Only retry once
  });
};