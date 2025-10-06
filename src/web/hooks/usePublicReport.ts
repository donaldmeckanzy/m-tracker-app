import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Hook for fetching public reports (no auth required)
export const usePublicReport = (reportId: string) => {
  return useQuery({
    queryKey: ['public-report', reportId],
    queryFn: async () => {
      console.log('🔍 Fetching public report:', reportId);
      console.log('🔗 Supabase URL:', supabase.supabaseUrl);
      console.log('🔑 Using anonymous access');
      
      try {
        // Test connection first
        console.log('🧪 Testing Supabase connection...');
        const { data: testData, error: testError } = await supabase
          .from('shared_reports')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error('❌ Connection test failed:', testError);
          throw new Error(`Database connection failed: ${testError.message}`);
        }
        
        console.log('✅ Connection test passed');
        
        // Now fetch the actual report
        console.log('📊 Fetching report data...');
        const { data, error } = await supabase
          .from('shared_reports')
          .select('report_data, expires_at, is_active, view_count, created_at')
          .eq('id', reportId)
          .single();

        if (error) {
          console.error('❌ Supabase query error:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw new Error(`Report not found: ${error.message}`);
        }

        console.log('✅ Report data received:', data);

        // Check if report is still active and not expired
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        
        console.log('🕐 Current time:', now.toISOString());
        console.log('⏰ Expires at:', expiresAt.toISOString());
        console.log('🟢 Is active:', data.is_active);
        
        if (!data.is_active) {
          console.warn('⚠️ Report is not active');
          throw new Error('This report has been deactivated');
        }
        
        if (now > expiresAt) {
          console.warn('⚠️ Report has expired');
          throw new Error('This report has expired');
        }

        console.log('✅ Report is valid and active');

        // Increment view count (fire and forget)
        console.log('📈 Updating view count...');
        supabase
          .from('shared_reports')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', reportId)
          .then((result) => {
            if (result.error) {
              console.warn('⚠️ Could not update view count:', result.error);
            } else {
              console.log('✅ View count updated');
            }
          });

        console.log('🎯 Returning report data:', data.report_data);
        return data.report_data;
        
      } catch (error) {
        console.error('💥 Unexpected error:', error);
        throw error;
      }
    },
    enabled: !!reportId,
    retry: 1, // Only retry once
  });
};