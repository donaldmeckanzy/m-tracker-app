// Utility to prevent system sleep and maintain timer accuracy
export class TimerInactivityPrevention {
  private wakeLock: any = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  async startPrevention(): Promise<void> {
    this.isActive = true;

    // Try to acquire a wake lock (modern browsers)
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        console.log('Wake lock acquired');
      } catch (err) {
        console.warn('Wake lock failed:', err);
      }
    }

    // Fallback: Regular heartbeat to keep system active
    this.startHeartbeat();
  }

  stopPrevention(): void {
    this.isActive = false;

    // Release wake lock
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
      console.log('Wake lock released');
    }

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startHeartbeat(): void {
    // Send a small heartbeat every 30 seconds to prevent system sleep
    this.heartbeatInterval = setInterval(() => {
      if (!this.isActive) return;

      // Create a small activity to prevent system sleep
      // This is a minimal network request that most systems won't sleep through
      const img = new Image();
      img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=${Date.now()}`;
      
      // Also trigger a small DOM manipulation
      const div = document.createElement('div');
      div.style.display = 'none';
      document.body.appendChild(div);
      setTimeout(() => document.body.removeChild(div), 1);
    }, 30000); // Every 30 seconds
  }

  // Handle page visibility changes
  handleVisibilityChange(): void {
    if (document.hidden && this.isActive) {
      // Page is hidden, but timer is running - maintain activity
      console.log('Page hidden, maintaining timer activity');
    } else if (!document.hidden && this.isActive) {
      // Page is visible again, re-acquire wake lock if needed
      if ('wakeLock' in navigator && !this.wakeLock) {
        this.startPrevention();
      }
    }
  }
}

export const timerInactivityPrevention = new TimerInactivityPrevention();