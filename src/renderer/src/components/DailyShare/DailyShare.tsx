import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Share2, Copy, Eye, Calendar, Clock, Target, CheckCircle } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import { useSettings } from '../../hooks/useSettings';
import { useSharedReports } from '../../hooks/useSharedReports';
import { formatDuration, formatTime } from '../../lib/utils';

const DailyShare: React.FC = () => {
  const { sessions } = useSessions();
  const { settings } = useSettings();
  const { createReport, isCreating } = useSharedReports();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [reportDate] = useState<Date>(new Date());

  // Filter sessions for today
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time).toDateString();
    return sessionDate === today;
  });

  // Calculate stats
  const totalTime = todaysSessions.reduce((total, session) => total + (session.duration_seconds || 0), 0);
  const taskBreakdown = todaysSessions.reduce((breakdown, session) => {
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

  const generateDailyReport = async () => {
    try {
      if (todaysSessions.length === 0 || totalTime === 0) {
        alert('No work sessions found for today. Please track some work first.');
        return;
      }

      // Set expiration to end of tomorrow (daily expiration)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);
      expiresAt.setHours(23, 59, 59, 999); // End of tomorrow

      // Generate report data
      const reportData = {
        date: reportDate.toISOString().split('T')[0],
        user_name: 'User',
        total_time_seconds: totalTime,
        daily_goal_hours: dailyGoalHours,
        goal_progress_percentage: Math.round(goalProgress),
        task_breakdown: Object.entries(taskBreakdown).map(([name, data]) => ({
          task_name: name,
          time_seconds: data.time,
          session_count: data.sessions,
        })),
        session_count: todaysSessions.length,
        includes_task_details: true,
        includes_goal_progress: true,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      // Create report
      const report = await createReport({
        report_data: reportData,
        expires_at: expiresAt.toISOString(),
      });

      // Generate shareable URL - always use Vercel URL for consistency
      const shareableUrl = `https://m-tracker-app.vercel.app/report/${report.id}`;
      setShareUrl(shareableUrl);

    } catch (error) {
      console.error('Error generating daily report:', error);
      
      let errorMessage = 'Failed to generate daily report. ';
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          errorMessage += 'Please make sure you are logged in.';
        } else if (error.message.includes('shared_reports')) {
          errorMessage += 'Database connection issue. Please try again.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
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
      alert('Failed to copy link. Please copy manually.');
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
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Share Daily Report</h1>
          <p className="text-muted-foreground">
            Create and share your daily productivity report with accountability partners
          </p>
        </div>

        <div className="space-y-6">
          {/* Today's Summary Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">{formatDate(reportDate)}</h2>
                <p className="text-sm text-muted-foreground">Today's Productivity Summary</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {/* Total Time */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Total Time</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{formatTime(totalTime)}</div>
              </div>

              {/* Sessions */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Work Sessions</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{todaysSessions.length}</div>
              </div>

              {/* Goal Progress */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Goal Progress</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{Math.round(goalProgress)}%</div>
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Daily Goal ({dailyGoalHours} hours)</span>
                <span className="font-medium">{formatTime(totalTime)} / {formatTime(dailyGoalHours * 3600)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Task Breakdown */}
            {Object.keys(taskBreakdown).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Task Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(taskBreakdown)
                    .sort(([,a], [,b]) => b.time - a.time)
                    .map(([taskName, data]) => (
                      <div key={taskName} className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{taskName}</div>
                          <div className="text-sm text-muted-foreground">
                            {data.sessions} session{data.sessions !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-foreground ml-4">
                          {formatDuration(data.time)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Share2 className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Share Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a shareable link that expires at the end of tomorrow
                </p>
              </div>
            </div>

            {!shareUrl ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <div className="font-medium mb-1">📅 Link Expiration</div>
                  <p>Your shareable link will automatically expire at the end of tomorrow for daily accountability.</p>
                </div>
                
                <Button 
                  onClick={generateDailyReport}
                  disabled={isCreating || totalTime === 0}
                  className="w-full"
                  size="lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {isCreating ? 'Generating Report...' : 'Generate Shareable Link'}
                </Button>

                {totalTime === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    No work sessions recorded for today. Start tracking to generate a report!
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Report Generated Successfully!</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-green-700 block mb-1">
                        Shareable Link (expires end of tomorrow):
                      </label>
                      <div className="text-sm text-green-600 break-all bg-white p-3 rounded border font-mono">
                        {shareUrl}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button 
                    onClick={() => copyToClipboard(shareUrl)}
                    variant="default"
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button 
                    onClick={() => window.open(shareUrl, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Report
                  </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyShare;