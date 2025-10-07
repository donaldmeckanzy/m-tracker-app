import { notFound } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { formatTime, formatDuration } from '../../../lib/utils'
import { format } from 'date-fns'
import { Calendar, Clock, Target, CheckCircle, Share2, Timer } from 'lucide-react'

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

interface SharedReport {
  id: string;
  report_data: ReportData;
  expires_at: string;
  created_at: string;
}

async function getReport(reportId: string): Promise<SharedReport | null> {
  const { data, error } = await supabase
    .from('shared_reports')
    .select('*')
    .eq('id', reportId)
    .single()

  if (error || !data) {
    return null
  }

  // Check if report has expired
  const now = new Date()
  const expiresAt = new Date(data.expires_at)
  
  if (now > expiresAt) {
    return null
  }

  return data
}

export default async function ReportPage({ params }: { params: { reportId: string } }) {
  const report = await getReport(params.reportId)

  if (!report) {
    notFound()
  }

  const reportData = report.report_data
  const reportDate = new Date(reportData.date)
  const createdAt = new Date(reportData.created_at)
  const expiresAt = new Date(report.expires_at)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Timer className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">M-Tracker</h1>
          </div>
          <p className="text-muted-foreground">Daily Productivity Report</p>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {/* Date and User Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">{formatDate(reportDate)}</h2>
                <p className="text-sm text-muted-foreground">
                  Productivity Report by {reportData.user_name}
                </p>
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
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(reportData.total_time_seconds)}
                </div>
              </div>

              {/* Sessions */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Work Sessions</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{reportData.session_count}</div>
              </div>

              {/* Goal Progress */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Goal Progress</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{reportData.goal_progress_percentage}%</div>
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Daily Goal ({reportData.daily_goal_hours} hours)
                </span>
                <span className="font-medium">
                  {formatTime(reportData.total_time_seconds)} / {formatTime(reportData.daily_goal_hours * 3600)}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(reportData.goal_progress_percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Task Breakdown */}
            {reportData.includes_task_details && reportData.task_breakdown.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Task Breakdown</h3>
                <div className="space-y-3">
                  {reportData.task_breakdown
                    .sort((a, b) => b.time_seconds - a.time_seconds)
                    .map((task, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{task.task_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.session_count} session{task.session_count !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-foreground ml-4">
                          {formatDuration(task.time_seconds)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Report Meta Info */}
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                <span>Generated: {format(createdAt, 'MMM d, yyyy at h:mm a')}</span>
              </div>
              <div className="text-right">
                <div>Expires: {format(expiresAt, 'MMM d, yyyy at h:mm a')}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>Generated with M-Tracker • Daily Productivity Tracking</p>
          </div>
        </div>
      </div>
    </div>
  )
}