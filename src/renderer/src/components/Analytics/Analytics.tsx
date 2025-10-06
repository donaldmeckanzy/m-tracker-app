import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="h-full p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Overview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Overview</h3>
            <div className="text-center text-muted-foreground py-8">
              Chart will be displayed here when data is available
            </div>
          </div>

          {/* Task Breakdown */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Task Breakdown</h3>
            <div className="text-center text-muted-foreground py-8">
              Task distribution chart will appear here
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Calendar View</h3>
            <div className="text-center text-muted-foreground py-8">
              Monthly calendar with productivity data coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;