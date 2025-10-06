import React from 'react';
import { useSessions } from '../../hooks/useSessions';
import { useSharedReports } from '../../hooks/useSharedReports';
import { supabase } from '../../lib/supabase';

const SharingDebug: React.FC = () => {
  const { sessions, isLoading: sessionsLoading } = useSessions();
  const { reports, isLoading: reportsLoading } = useSharedReports();

  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      
      // Test authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('User:', user);
      if (authError) {
        console.error('Auth error:', authError);
        return;
      }

      // Test shared_reports table access
      const { data, error } = await supabase
        .from('shared_reports')
        .select('*')
        .limit(1);
      
      console.log('Shared reports test:', { data, error });
      
      if (error) {
        if (error.code === '42P01') {
          alert('❌ shared_reports table does not exist. Please run the database setup SQL.');
        } else {
          alert(`❌ Database error: ${error.message}`);
        }
      } else {
        alert('✅ Database connection and shared_reports table working!');
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert(`❌ Test failed: ${error}`);
    }
  };

  const today = new Date().toDateString();
  const todaysSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time).toDateString();
    return sessionDate === today;
  });

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-yellow-800">🔧 Sharing Debug Panel</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Sessions Loading:</strong> {sessionsLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Total Sessions:</strong> {sessions.length}
        </div>
        <div>
          <strong>Today's Sessions:</strong> {todaysSessions.length}
        </div>
        <div>
          <strong>Reports Loading:</strong> {reportsLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Existing Reports:</strong> {reports.length}
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={testDatabaseConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Database Connection
        </button>
      </div>

      {todaysSessions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-yellow-800">Today's Sessions:</h4>
          {todaysSessions.map((session, index) => (
            <div key={session.id} className="text-xs bg-white p-2 rounded border">
              <div><strong>Task:</strong> {session.task_name}</div>
              <div><strong>Duration:</strong> {session.duration_seconds}s</div>
              <div><strong>Start:</strong> {new Date(session.start_time).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      )}

      {reports.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-yellow-800">Existing Reports:</h4>
          {reports.slice(0, 3).map((report) => (
            <div key={report.id} className="text-xs bg-white p-2 rounded border">
              <div><strong>ID:</strong> {report.id}</div>
              <div><strong>Created:</strong> {new Date(report.created_at).toLocaleString()}</div>
              <div><strong>Expires:</strong> {new Date(report.expires_at).toLocaleString()}</div>
              <div><strong>Active:</strong> {report.is_active ? 'Yes' : 'No'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharingDebug;