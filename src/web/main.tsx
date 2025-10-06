import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicReport from './components/PublicReport';
import TestReport from './components/TestReport';
import '../renderer/src/index.css';

const queryClient = new QueryClient();

function WebApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/test" element={<TestReport />} />
            <Route path="/report/:id" element={<PublicReport />} />
            <Route path="/" element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    M-Tracker Reports
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Accountability reports shared from the M-Tracker desktop app
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      To view a report, you need a valid report link shared by an M-Tracker user.
                    </p>
                    <div className="mt-4">
                      <a href="/test" className="text-blue-600 hover:text-blue-800">
                        🧪 Test Page (Debug)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WebApp />
  </React.StrictMode>
);