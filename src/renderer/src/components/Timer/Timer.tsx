import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { useTimerStore } from '../../stores/timerStore';
import { useSessions } from '../../hooks/useSessions';
import { formatTime } from '../../lib/utils';
import { timerInactivityPrevention } from '../../lib/inactivityPrevention';
import RecentTasks from './RecentTasks';

const Timer: React.FC = () => {
  const {
    isRunning,
    startTime,
    elapsedTime,
    pausedTime,
    currentTaskName,
    resumingSessionId,
    startTimer,
    resumeExistingTask,
    stopTimer,
    pauseTimer,
    resumeTimer,
    updateTaskName,
    setElapsedTime,
  } = useTimerStore();

  const { saveSession, updateSession } = useSessions();
  const [taskInput, setTaskInput] = useState(currentTaskName);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      // Start inactivity prevention when timer starts
      timerInactivityPrevention.startPrevention();
      
      interval = setInterval(() => {
        const now = Date.now();
        const currentSessionTime = Math.floor((now - startTime.getTime()) / 1000);
        const totalElapsed = pausedTime + currentSessionTime;
        setElapsedTime(totalElapsed);
      }, 1000);
    } else {
      // Stop inactivity prevention when timer stops
      timerInactivityPrevention.stopPrevention();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime, pausedTime, setElapsedTime]);

  // Handle page visibility changes for inactivity prevention
  useEffect(() => {
    const handleVisibilityChange = () => {
      timerInactivityPrevention.handleVisibilityChange();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Clean up on component unmount
      timerInactivityPrevention.stopPrevention();
    };
  }, []);

  const handleStart = () => {
    if (taskInput.trim()) {
      startTimer(taskInput.trim());
    }
  };

  const handleStop = () => {
    const saveSessionWrapper = async (sessionData: any) => {
      await saveSession(sessionData);
    };
    const updateSessionWrapper = async (sessionId: string, updates: any) => {
      await updateSession(sessionId, updates);
    };
    stopTimer(saveSessionWrapper, updateSessionWrapper);
    // Don't clear the task input immediately - let user see what they just completed
    // setTaskInput(''); // Removed this line
  };

  const handleResumeTask = (taskName: string, sessionId: string, totalDuration: number) => {
    setTaskInput(taskName);
    resumeExistingTask(taskName, sessionId, totalDuration);
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaskInput(value);
    if (isRunning) {
      updateTaskName(value);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Timer Display */}
        <div className="text-center">
          <div className="timer-display text-8xl font-bold text-foreground mb-4">
            {formatTime(elapsedTime)}
          </div>
          {isRunning && (
            <div className="text-sm text-muted-foreground">
              Timer started at {startTime?.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Task Input */}
        <div className="space-y-2">
          <label htmlFor="task-input" className="block text-sm font-medium text-foreground">
            What are you working on?
          </label>
          <input
            id="task-input"
            type="text"
            value={taskInput}
            onChange={handleTaskInputChange}
            placeholder="Enter task name..."
            disabled={isRunning && !currentTaskName}
            className="w-full px-4 py-3 text-lg border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRunning && !currentTaskName ? (
            // Ready to start new timer
            <Button
              onClick={handleStart}
              disabled={!taskInput.trim()}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Timer
            </Button>
          ) : !isRunning && currentTaskName && elapsedTime > 0 ? (
            // Paused state - timer has time and is paused
            <>
              <Button
                onClick={resumeTimer}
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
              <Button
                onClick={handleStop}
                variant="destructive"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          ) : isRunning ? (
            // Running state
            <>
              <Button
                onClick={pauseTimer}
                variant="secondary"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
              <Button
                onClick={handleStop}
                variant="destructive"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          ) : (
            // Default fallback - ready to start
            <Button
              onClick={handleStart}
              disabled={!taskInput.trim()}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Timer
            </Button>
          )}
        </div>

        {/* Current Session Info */}
        {isRunning && currentTaskName && (
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              {resumingSessionId ? 'Continuing work on:' : 'Currently working on:'}
            </div>
            <div className="font-medium text-foreground">{currentTaskName}</div>
            {resumingSessionId && (
              <div className="text-xs text-blue-600 mt-1">
                Resuming existing session
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Timer protected from system sleep
            </div>
          </div>
        )}

        {/* Recent Tasks - Only show when not running */}
        {!isRunning && (
          <RecentTasks 
            onSelectTask={(taskName) => setTaskInput(taskName)} 
            onResumeTask={handleResumeTask}
          />
        )}
      </div>
    </div>
  );
};

export default Timer;