import React, { useState } from 'react';
import { useSessions } from '../../hooks/useSessions';
import { useSettings } from '../../hooks/useSettings';
import { formatDuration } from '../../lib/utils';
import { format, startOfWeek, endOfWeek, subDays, isWithinInterval } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

type DateFilter = 'today' | 'yesterday' | 'this-week' | 'last-7-days';

const Dashboard: React.FC = () => {
  const { sessions, isLoading, todayTotal, weekTotal } = useSessions();
  const { settings, isLoading: settingsLoading } = useSettings();
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');

  const dailyGoal = settings?.daily_goal_hours || 6;
  const todayGoalProgress = (todayTotal / (dailyGoal * 3600)) * 100;

  // Filter sessions based on selected date range
  const getFilteredSessions = () => {
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return sessions.filter(session => {
          const sessionDate = new Date(session.start_time).toDateString();
          return sessionDate === now.toDateString();
        });
      
      case 'yesterday':
        const yesterday = subDays(now, 1);
        return sessions.filter(session => {
          const sessionDate = new Date(session.start_time).toDateString();
          return sessionDate === yesterday.toDateString();
        });
      
      case 'this-week':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        return sessions.filter(session => {
          const sessionDate = new Date(session.start_time);
          return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
        });
      
      case 'last-7-days':
        const sevenDaysAgo = subDays(now, 7);
        return sessions.filter(session => {
          const sessionDate = new Date(session.start_time);
          return sessionDate >= sevenDaysAgo && sessionDate <= now;
        });
      
      default:
        return sessions;
    }
  };

  const filteredSessions = getFilteredSessions();
  
  // Calculate total time for filtered sessions
  const filteredTotal = filteredSessions.reduce((total, session) => 
    total + (session.duration_seconds || 0), 0
  );

  if (isLoading || settingsLoading) {
    return (
      <div className="h-full p-8 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Today</h3>
            <div className="text-3xl font-bold text-primary">
              {formatDuration(todayTotal)}
            </div>
            <p className="text-sm text-muted-foreground">Total tracked time</p>
            <div className="mt-3">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(todayGoalProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(todayGoalProgress)}% of daily goal
              </p>
            </div>
          </div>

          {/* This Week */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">This Week</h3>
            <div className="text-3xl font-bold text-primary">
              {formatDuration(weekTotal)}
            </div>
            <p className="text-sm text-muted-foreground">Weekly progress</p>
          </div>

          {/* Daily Goal */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Daily Goal</h3>
            <div className="text-3xl font-bold text-primary">{dailyGoal}h</div>
            <p className="text-sm text-muted-foreground">Target hours</p>
          </div>
          </div>

          {/* Sessions with Date Filter */}
          <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Work Sessions
            </h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="today">📅 Today</option>
                <option value="yesterday">⏪ Yesterday</option>
                <option value="this-week">📊 This Week</option>
                <option value="last-7-days">📈 Last 7 Days</option>
              </select>
            </div>
          </div>
          
          {/* Summary for filtered period */}
          <div className="mb-4 p-3 bg-accent rounded-lg">
            <div className="text-sm text-muted-foreground">
              Total time for {dateFilter.replace('-', ' ')}:
            </div>
            <div className="text-xl font-bold text-primary">
              {formatDuration(filteredTotal)}
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No sessions found for the selected period.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{session.task_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.start_time), 'MMM d, h:mm a')} - {format(new Date(session.end_time || session.start_time), 'h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {formatDuration(session.duration_seconds || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;