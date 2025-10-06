import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Target, User, TrendingUp, Coffee } from 'lucide-react';
import { formatDuration, formatTime } from '../../lib/utils';
import { usePublicReport } from '../../hooks/useSharedReports';

interface ReportData {
  date: string;
  user_name: string;
  total_time_seconds: number;
  daily_goal_hours: number;
  goal_progress_percentage: number;
  task_breakdown: Array<{
    task_name: string;
    time_seconds: number;
    session_count: number;
  }>;
  session_count: number;
  includes_task_details: boolean;
  includes_goal_progress: boolean;
  created_at: string;
  expires_at: string;
}

const PublicReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { data: report, isLoading: loading, error } = usePublicReport(reportId || '');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMotivationalMessage = (progress: number, totalHours: number) => {
    if (progress >= 100) return "🔥 Crushing it! Goal exceeded!";
    if (progress >= 80) return "💪 Almost there! Keep pushing!";
    if (progress >= 60) return "📈 Great progress! Stay focused!";
    if (progress >= 40) return "⚡ Building momentum!";
    if (totalHours >= 1) return "🌱 Every hour counts! Keep going!";
    return "🚀 Ready to start the productive day!";
  };

  const getProductivityRating = (hours: number) => {
    if (hours >= 8) return { rating: "Exceptional", emoji: "🏆", color: "text-yellow-600" };
    if (hours >= 6) return { rating: "Excellent", emoji: "🎯", color: "text-green-600" };
    if (hours >= 4) return { rating: "Good", emoji: "📈", color: "text-blue-600" };
    if (hours >= 2) return { rating: "Fair", emoji: "⚡", color: "text-orange-600" };
    return { rating: "Getting Started", emoji: "🌱", color: "text-gray-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading productivity report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">😔</div>
          <h2 className="text-2xl font-semibold text-foreground">Report Not Available</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'This report could not be found or has expired.'}
          </p>
        </div>
      </div>
    );
  }

  const totalHours = report.total_time_seconds / 3600;
  const productivity = getProductivityRating(totalHours);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Productivity Report</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {report.user_name}'s Work Day
          </h1>
          <p className="text-lg text-gray-600">{formatDate(report.date)}</p>
        </div>

        {/* Main Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Total Time */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatTime(report.total_time_seconds)}
              </div>
              <p className="text-sm text-gray-600">Total Focus Time</p>
            </div>

            {/* Productivity Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl">{productivity.emoji}</div>
              <div className={`text-2xl font-bold ${productivity.color}`}>
                {productivity.rating}
              </div>
              <p className="text-sm text-gray-600">Productivity Level</p>
            </div>

            {/* Sessions */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <Coffee className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {report.session_count}
              </div>
              <p className="text-sm text-gray-600">Work Sessions</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <p className="text-lg font-medium text-gray-800">
              {getMotivationalMessage(report.goal_progress_percentage, totalHours)}
            </p>
          </div>
        </div>

        {/* Goal Progress */}
        {report.includes_goal_progress && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-gray-900">Daily Goal Progress</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {formatTime(report.total_time_seconds)} of {report.daily_goal_hours}h goal
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {report.goal_progress_percentage}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all ${
                    report.goal_progress_percentage >= 100 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : report.goal_progress_percentage >= 80
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${Math.min(report.goal_progress_percentage, 100)}%` }}
                />
              </div>
              
              {report.goal_progress_percentage >= 100 && (
                <div className="text-center text-green-600 font-medium">
                  🎉 Goal achieved! {((report.total_time_seconds / 3600) - report.daily_goal_hours).toFixed(1)}h bonus time!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Task Breakdown */}
        {report.includes_task_details && report.task_breakdown.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Task Breakdown</h3>
            
            <div className="space-y-3">
              {report.task_breakdown
                .sort((a: any, b: any) => b.time_seconds - a.time_seconds)
                .map((task: any, index: number) => {
                  const percentage = (task.time_seconds / report.total_time_seconds) * 100;
                  return (
                    <div key={task.task_name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-orange-500' :
                            'bg-gray-400'
                          }`} />
                          <span className="font-medium text-gray-900">{task.task_name}</span>
                          <span className="text-xs text-gray-500">
                            ({task.session_count} session{task.session_count !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {formatDuration(task.time_seconds)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-orange-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            Generated on {new Date(report.created_at).toLocaleDateString()} • 
            <span className="ml-1">Powered by M-Tracker</span>
          </p>
          <div className="mt-4">
            <a 
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Start Your Own Productivity Journey</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicReport;