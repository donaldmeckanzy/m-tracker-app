import { create } from 'zustand';

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  pausedTime: number; // Track accumulated time when paused
  elapsedTime: number;
  currentTaskName: string;
  actualStartTime: Date | null; // Track the actual start time of the session
  resumingSessionId: string | null; // Track session ID when resuming existing task
  
  startTimer: (taskName: string) => void;
  resumeExistingTask: (taskName: string, existingSessionId: string, existingDuration: number) => void;
  stopTimer: (saveSessionFn?: (session: SessionData) => Promise<void>, updateSessionFn?: (sessionId: string, updates: any) => Promise<void>) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  updateTaskName: (taskName: string) => void;
  setElapsedTime: (time: number) => void;
  reset: () => void;
}

export interface SessionData {
  task_name: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  notes?: string;
  tags?: string[];
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  startTime: null,
  pausedTime: 0,
  elapsedTime: 0,
  currentTaskName: '',
  actualStartTime: null,
  resumingSessionId: null,

  startTimer: (taskName: string) => {
    const now = new Date();
    set({
      isRunning: true,
      startTime: now,
      actualStartTime: now,
      currentTaskName: taskName,
      elapsedTime: 0,
      pausedTime: 0,
      resumingSessionId: null, // Clear any existing session ID for new tasks
    });
  },

  resumeExistingTask: (taskName: string, existingSessionId: string, existingDuration: number) => {
    const now = new Date();
    set({
      isRunning: true,
      startTime: now,
      actualStartTime: now, // Will be ignored when updating existing session
      currentTaskName: taskName,
      elapsedTime: existingDuration,
      pausedTime: existingDuration,
      resumingSessionId: existingSessionId,
    });
  },

  stopTimer: async (saveSessionFn, updateSessionFn) => {
    const state = get();
    if (state.currentTaskName && state.elapsedTime > 0) {
      const endTime = new Date();
      
      if (state.resumingSessionId && updateSessionFn) {
        // Update existing session
        try {
          await updateSessionFn(state.resumingSessionId, {
            end_time: endTime.toISOString(),
            duration_seconds: state.elapsedTime,
          });
        } catch (error) {
          console.error('Error updating session:', error);
        }
      } else if (state.actualStartTime && saveSessionFn) {
        // Create new session
        const sessionData: SessionData = {
          task_name: state.currentTaskName,
          start_time: state.actualStartTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_seconds: state.elapsedTime,
        };

        try {
          await saveSessionFn(sessionData);
        } catch (error) {
          console.error('Error saving session:', error);
        }
      }

      set({
        isRunning: false,
        startTime: null,
        actualStartTime: null,
        elapsedTime: 0,
        pausedTime: 0,
        currentTaskName: '',
        resumingSessionId: null,
      });
    } else {
      // If no meaningful work was done, just reset
      set({
        isRunning: false,
        startTime: null,
        actualStartTime: null,
        elapsedTime: 0,
        pausedTime: 0,
        currentTaskName: '',
        resumingSessionId: null,
      });
    }
  },

  pauseTimer: () => {
    const state = get();
    set({ 
      isRunning: false,
      pausedTime: state.elapsedTime, // Store current elapsed time
      startTime: null, // Clear start time when paused
    });
  },

  resumeTimer: () => {
    const now = new Date();
    set({ 
      isRunning: true,
      startTime: now, // Set new start time for resume
    });
  },

  updateTaskName: (taskName: string) => {
    set({ currentTaskName: taskName });
  },

  setElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },

  reset: () => {
    set({
      isRunning: false,
      startTime: null,
      actualStartTime: null,
      elapsedTime: 0,
      pausedTime: 0,
      currentTaskName: '',
      resumingSessionId: null,
    });
  },
}));