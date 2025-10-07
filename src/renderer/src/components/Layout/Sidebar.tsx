import React from 'react';
import { NavLink } from 'react-router-dom';
import { Timer, Share2, Settings, Home } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/timer', icon: Timer, label: 'Timer' },
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/share', icon: Share2, label: 'Share Daily Report' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">M-Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Productivity Timer</p>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;