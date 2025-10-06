import React from 'react';

const TestReport: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 M-Tracker Report Test Page</h1>
      
      <div style={{ background: '#f0f0f0', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>✅ React is Working</h2>
        <p>If you can see this page, React is rendering correctly.</p>
      </div>

      <div style={{ background: '#e7f3ff', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>🔍 Debug Information</h2>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Path:</strong> {window.location.pathname}</p>
        <p><strong>Report ID:</strong> {window.location.pathname.split('/').pop()}</p>
      </div>

      <div style={{ background: '#fff3cd', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>⚠️ Next Steps</h2>
        <ol>
          <li>If you see this page, the web app is loading</li>
          <li>Check browser console (F12) for any errors</li>
          <li>Verify the report ID in the URL is correct</li>
          <li>Test database connection</li>
        </ol>
      </div>

      <div style={{ background: '#d4edda', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>🔗 Test Links</h2>
        <ul>
          <li><a href="/">Home Page</a></li>
          <li><a href="/report/test">Test Report URL</a></li>
        </ul>
      </div>
    </div>
  );
};

export default TestReport;