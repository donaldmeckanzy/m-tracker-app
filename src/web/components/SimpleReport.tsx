import React from 'react';
import { useParams } from 'react-router-dom';
import { usePublicReport } from '../hooks/usePublicReport';

const SimpleReport: React.FC = () => {
  const { id: reportId } = useParams<{ id: string }>();
  const { data: report, isLoading, error } = usePublicReport(reportId || '');

  console.log('🔍 SimpleReport Debug:', {
    reportId,
    isLoading,
    error,
    report,
    hasData: !!report
  });

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>🧪 Simple Report Debug View</h1>
      
      <div style={{ background: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>📊 Report Status</h2>
        <p><strong>Report ID:</strong> {reportId || 'No ID provided'}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error ? String(error) : 'None'}</p>
        <p><strong>Has Data:</strong> {report ? 'Yes' : 'No'}</p>
      </div>

      {isLoading && (
        <div style={{ background: '#e7f3ff', padding: '15px', borderRadius: '5px' }}>
          <h3>⏳ Loading...</h3>
          <p>Fetching report data from database...</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '5px' }}>
          <h3>❌ Error</h3>
          <p><strong>Error Message:</strong> {error instanceof Error ? error.message : String(error)}</p>
          <p><strong>Check Console:</strong> Open browser DevTools (F12) for detailed logs</p>
        </div>
      )}

      {report && (
        <div style={{ background: '#d4edda', padding: '15px', borderRadius: '5px' }}>
          <h3>✅ Report Data Found</h3>
          <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '3px', marginTop: '10px' }}>
            <h4>Raw Data:</h4>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
          
          {report.total_time_seconds && (
            <div style={{ marginTop: '15px' }}>
              <h4>📈 Quick Summary:</h4>
              <ul>
                <li><strong>Date:</strong> {report.date}</li>
                <li><strong>Total Time:</strong> {Math.floor(report.total_time_seconds / 3600)}h {Math.floor((report.total_time_seconds % 3600) / 60)}m</li>
                <li><strong>Sessions:</strong> {report.session_count}</li>
                <li><strong>Goal Progress:</strong> {report.goal_progress_percentage}%</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ background: '#fff3cd', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h3>🔗 Navigation</h3>
        <ul>
          <li><a href="/">← Back to Home</a></li>
          <li><a href="/test">🧪 Test Page</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleReport;