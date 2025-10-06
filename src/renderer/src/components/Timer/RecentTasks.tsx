import React from 'react';
import { useSessions } from '../../hooks/useSessions';
import { formatDuration } from '../../lib/utils';
import { Clock } from 'lucide-react';

interface RecentTasksProps {
  onSelectTask: (taskName: string) => void;
  onResumeTask: (taskName: string, sessionId: string, totalDuration: number) => void;
}

const RecentTasks: React.FC<RecentTasksProps> = ({ onSelectTask, onResumeTask }) => {
  const { sessions } = useSessions();

  // Get unique tasks from today, excluding current session
  const today = new Date().toDateString();
  const todaysTasks = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time).toDateString();
      return sessionDate === today;
    })
    .reduce((unique, session) => {
      const taskName = session.task_name;
      if (!unique.some(task => task.name === taskName)) {
        // Get the most recent session for this task to use as the resumption target
        const taskSessions = sessions
          .filter(s => 
            s.task_name === taskName && 
            new Date(s.start_time).toDateString() === today
          )
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        
        const mostRecentSession = taskSessions[0];
        const totalTime = taskSessions.reduce((total, s) => total + (s.duration_seconds || 0), 0);
        
        unique.push({
          name: taskName,
          totalTime,
          lastWorked: session.start_time,
          sessionId: mostRecentSession.id, // Store the most recent session ID for resumption
        });
      }
      return unique;
    }, [] as Array<{ name: string; totalTime: number; lastWorked: string; sessionId: string }>)
    .sort((a, b) => new Date(b.lastWorked).getTime() - new Date(a.lastWorked).getTime())
    .slice(0, 5); // Show only 5 most recent

  if (todaysTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Resume Today's Tasks
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Click any task to continue where you left off
      </p>
      <div className="space-y-2">
        {todaysTasks.map((task) => (
          <button
            key={task.name}
            onClick={() => onResumeTask(task.name, task.sessionId, task.totalTime)}
            className="w-full text-left p-3 rounded-md bg-accent hover:bg-accent/80 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {task.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total today: {formatDuration(task.totalTime)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                Continue →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;