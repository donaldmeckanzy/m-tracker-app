import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Share2, Copy, Eye, EyeOff, Calendar, Clock, Target, Wifi, Smartphone } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import { useSettings } from '../../hooks/useSettings';
import { useSharedReports } from '../../hooks/useSharedReports';
import { formatDuration, formatTime } from '../../lib/utils';
import { getComputerIP } from '../../lib/networkUtils';

interface ShareReportProps {
  selectedDate?: Date;
}

const ShareReport: React.FC<ShareReportProps> = ({ selectedDate = new Date() }) => {
  const { sessions } = useSessions();
  const { settings } = useSettings();
  const { createReport, isCreating } = useSharedReports();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [networkUrl, setNetworkUrl] = useState<string | null>(null);
  const [includeTaskDetails, setIncludeTaskDetails] = useState(true);
  const [includeGoalProgress, setIncludeGoalProgress] = useState(true);
  const [expiresIn, setExpiresIn] = useState<'24h' | '7d' | '30d'>('24h');
  const [showNetworkOptions, setShowNetworkOptions] = useState(false);

  // Filter sessions for selected date
  const selectedDateStr = selectedDate.toDateString();
  const daysSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time).toDateString();
    return sessionDate === selectedDateStr;
  });

  // Calculate stats
  const totalTime = daysSessions.reduce((total, session) => total + (session.duration_seconds || 0), 0);
  const taskBreakdown = daysSessions.reduce((breakdown, session) => {
    const taskName = session.task_name;
    if (!breakdown[taskName]) {
      breakdown[taskName] = { time: 0, sessions: 0 };
    }
    breakdown[taskName].time += session.duration_seconds || 0;
    breakdown[taskName].sessions += 1;
    return breakdown;
  }, {} as Record<string, { time: number; sessions: number }>);

  const dailyGoalHours = settings?.daily_goal_hours || 6;
  const goalProgress = (totalTime / (dailyGoalHours * 3600)) * 100;

  const generateShareableReport = async () => {
    try {
      console.log('Starting report generation...');
      console.log('Sessions data:', daysSessions);
      console.log('Total time:', totalTime);

      if (daysSessions.length === 0 || totalTime === 0) {
        alert('No work sessions found for this date. Please track some work first.');
        return;
      }

      // Calculate expiration date
      const expiresAt = new Date();
      switch (expiresIn) {
        case '24h':
          expiresAt.setDate(expiresAt.getDate() + 1);
          break;
        case '7d':
          expiresAt.setDate(expiresAt.getDate() + 7);
          break;
        case '30d':
          expiresAt.setDate(expiresAt.getDate() + 30);
          break;
      }

      // Generate report data
      const reportData = {
        date: selectedDate.toISOString().split('T')[0],
        user_name: 'User', // We'll get this from auth context if available
        total_time_seconds: totalTime,
        daily_goal_hours: dailyGoalHours,
        goal_progress_percentage: Math.round(goalProgress),
        task_breakdown: includeTaskDetails ? Object.entries(taskBreakdown).map(([name, data]) => ({
          task_name: name,
          time_seconds: data.time,
          session_count: data.sessions,
        })) : [],
        session_count: daysSessions.length,
        includes_task_details: includeTaskDetails,
        includes_goal_progress: includeGoalProgress,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      console.log('Report data:', reportData);

      // Create report using hook
      console.log('Creating report...');
      const report = await createReport({
        report_data: reportData,
        expires_at: expiresAt.toISOString(),
      });

      console.log('Report created:', report);

      // Generate shareable URL
      // For Electron app, we need to use a web-accessible URL
      // In development, this will be localhost, but in production it should be your domain
      const baseUrl = window.location.origin;
      
      // Check if we're in development (localhost) and provide a warning
      const isDevelopment = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
      const shareableUrl = `${baseUrl}/report/${report.id}`;
      
      setShareUrl(shareableUrl);

      // If in development, try to generate network-accessible URL
      if (isDevelopment) {
        console.warn('Development URL generated. This will only work on the same network.');
        try {
          const ip = await getComputerIP();
          if (ip && !ip.startsWith('127.')) {
            const port = window.location.port || '5174';
            const networkAccessibleUrl = `http://${ip}:${port}/report/${report.id}`;
            setNetworkUrl(networkAccessibleUrl);
            console.log('Network URL generated:', networkAccessibleUrl);
          }
        } catch (error) {
          console.warn('Could not generate network URL:', error);
        }
      }

      console.log('Shareable URL generated:', shareableUrl);

    } catch (error) {
      console.error('Detailed error generating report:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to generate shareable report. ';
      
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          errorMessage += 'Please make sure you are logged in.';
        } else if (error.message.includes('shared_reports')) {
          errorMessage += 'Database table missing. Please check database setup.';
        } else if (error.message.includes('permission')) {
          errorMessage += 'Permission denied. Please check your account settings.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Please try again or check the console for details.';
      }
      
      alert(errorMessage);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <div className="flex items-center space-x-3">
          <Share2 className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Share Daily Report</h3>
            <p className="text-sm text-muted-foreground">
              Create an accountability link for {formatDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-accent/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-lg font-bold">{formatTime(totalTime)}</span>
          </div>
        </div>

        {includeGoalProgress && (
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span>Daily Goal Progress</span>
                <span>{Math.round(goalProgress)}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mt-1">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {includeTaskDetails && Object.keys(taskBreakdown).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Task Breakdown:</h4>
            <div className="space-y-1">
              {Object.entries(taskBreakdown)
                .sort(([,a], [,b]) => b.time - a.time)
                .slice(0, 5)
                .map(([taskName, data]) => (
                  <div key={taskName} className="flex justify-between text-sm">
                    <span className="truncate flex-1 mr-2">{taskName}</span>
                    <span className="font-mono">{formatDuration(data.time)}</span>
                  </div>
                ))}
              {Object.keys(taskBreakdown).length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{Object.keys(taskBreakdown).length - 5} more tasks
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Privacy Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Privacy & Sharing Options</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={includeTaskDetails}
                onChange={(e) => setIncludeTaskDetails(e.target.checked)}
                className="rounded border-input mt-0.5 flex-shrink-0"
              />
              <span className="text-sm">Include task names and breakdown</span>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={includeGoalProgress}
                onChange={(e) => setIncludeGoalProgress(e.target.checked)}
                className="rounded border-input mt-0.5 flex-shrink-0"
              />
              <span className="text-sm">Include daily goal progress</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link expires in:</label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value as '24h' | '7d' | '30d')}
              className="w-full sm:w-auto px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate/Share Actions */}
      <div className="space-y-3">
        {!shareUrl ? (
          <Button 
            onClick={generateShareableReport}
            disabled={isCreating || totalTime === 0}
            className="w-full"
            size="lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isCreating ? 'Generating Report...' : 'Generate Shareable Link'}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium text-green-800 mb-2">
                ✅ Shareable report created!
              </div>
              
              {/* Main URL */}
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1">
                    💻 Computer URL (localhost):
                  </div>
                  <div className="text-xs text-green-600 break-all bg-white p-2 rounded border">
                    {shareUrl}
                  </div>
                </div>
                
                {/* Network URL for mobile */}
                {networkUrl && (
                  <div>
                    <div className="text-xs font-medium text-blue-700 mb-1 flex items-center">
                      <Smartphone className="w-3 h-3 mr-1" />
                      Mobile/Network URL:
                    </div>
                    <div className="text-xs text-blue-600 break-all bg-blue-50 p-2 rounded border">
                      {networkUrl}
                    </div>
                    <div className="text-xs text-blue-500 mt-1">
                      ✅ Use this URL to access from your phone (same WiFi network)
                    </div>
                  </div>
                )}
                
                {/* Show network options button if localhost */}
                {(shareUrl.includes('localhost') || shareUrl.includes('127.0.0.1')) && !networkUrl && (
                  <button
                    onClick={() => setShowNetworkOptions(!showNetworkOptions)}
                    className="text-xs text-orange-600 hover:text-orange-700 flex items-center"
                  >
                    <Wifi className="w-3 h-3 mr-1" />
                    Need mobile access? Click here for instructions
                  </button>
                )}
                
                {/* Network instructions */}
                {showNetworkOptions && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-3 rounded border border-orange-200">
                    <div className="font-medium mb-2">📱 For Mobile Access:</div>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Find your computer's IP address (System Preferences → Network)</li>
                      <li>Replace "localhost" with your IP (e.g., 192.168.1.100)</li>
                      <li>Make sure your phone is on the same WiFi network</li>
                      <li>Example: Change localhost:5174 to 192.168.1.100:5174</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Main action buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  onClick={() => copyToClipboard(shareUrl)}
                  variant="outline" 
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Computer Link
                </Button>
                
                <Button 
                  onClick={() => window.open(shareUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              
              {/* Mobile-specific actions */}
              {networkUrl && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    onClick={() => copyToClipboard(networkUrl)}
                    variant="outline" 
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Copy Mobile Link
                  </Button>
                </div>
              )}
            </div>

            <Button 
              onClick={() => setShareUrl(null)}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Generate New Link
            </Button>
          </div>
        )}

        {totalTime === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No work sessions recorded for this date
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareReport;