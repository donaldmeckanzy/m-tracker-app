# M-Tracker - Productivity Task Tracker

A cross-platform desktop application for tracking work time and tasks. Built with Electron, React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **Advanced Timer & Task Tracking**: Large, prominent start/stop/pause timer with accurate time tracking and task labeling
- **Task Resumption**: Easily resume any task you worked on earlier in the day - perfect for real work scenarios
- **Inactivity Prevention**: Timer stays accurate even during system sleep, screen lock, or app minimization
- **User Authentication**: Secure sign up/sign in with Supabase Auth
- **Session Management**: Automatic saving of timed work sessions with task names and durations
- **Smart Dashboard**: Today's summary, weekly progress, and session history with flexible date filtering
- **Advanced Analytics**: View work patterns across Today, Yesterday, This Week, or Last 7 Days
- **Intelligent Settings**: Customizable daily goals with validation (1-24 hours), theme selection, and data export

### 🤝 Accountability & Sharing
- **Daily Report Sharing**: Generate beautiful, shareable reports of your daily productivity
- **Web Interface**: Reports are viewable on a live web interface at `https://m-tracker-app.vercel.app`
- **Automatic Expiration**: Reports automatically expire daily for privacy and accountability
- **Seamless Link Copying**: One-click copy to clipboard for easy sharing
- **No Duration Selection**: Simplified UX - just generate and share today's report
- **No Registration Required**: Accountability partners can view reports without creating accounts
- **Mobile Responsive**: Reports look great on all devices

### 🎨 Design
- **Modern UI**: Clean, minimalist interface inspired by Linear, Raycast, and Arc Browser
- **Dark/Light Mode**: System theme detection with manual override
- **Responsive Layout**: Sidebar navigation with clear content areas
- **Accessibility**: Keyboard shortcuts and screen reader support

### 🔧 Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron for cross-platform (Mac & Windows)
- **Backend**: Supabase (PostgreSQL + Authentication)
- **State Management**: Zustand for timer state
- **Build Tool**: Vite for fast development and building
- **UI Components**: Radix UI primitives with custom styling

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd m-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (Already configured)
   - Database URL: `https://rdfclpbgvqgdnypcuzhr.supabase.co`
   - The app is pre-configured with the Supabase connection

4. **Start development**
   ```bash
   npm run dev
   ```
   This starts both the Vite dev server and Electron in development mode.

### Available Scripts

```bash
# Development
npm run dev              # Start both Vite and Electron in dev mode
npm run dev:vite         # Start only the Vite dev server
npm run dev:electron     # Start only Electron (requires Vite to be running)

# Building
npm run build            # Build both renderer and main process
npm run build:vite       # Build the React app with Vite
npm run build:electron   # Build the Electron main process

# Distribution
npm run build:mac        # Build macOS .dmg installer
npm run build:win        # Build Windows .exe installer
npm run build:all        # Build for both platforms

# Development Tools
npm run lint             # ESLint code checking
npm run type-check       # TypeScript type checking
```

## Project Structure

```
m-tracker-app/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Entry point, window management
│   │   └── preload.ts       # Preload script for IPC
│   └── renderer/            # React application
│       └── src/
│           ├── components/
│           │   ├── Timer/           # Timer display and controls
│           │   ├── Dashboard/       # Today's summary and stats
│           │   ├── DailyShare/      # Daily report sharing
│           │   ├── Settings/        # App preferences
│           │   ├── Auth/           # Authentication pages
│           │   ├── Layout/         # Sidebar and main layout
│           │   └── ui/             # Reusable UI components
│           ├── lib/
│           │   ├── supabase.ts     # Database client and types
│           │   └── utils.ts        # Utility functions
│           ├── stores/
│           │   └── timerStore.ts   # Zustand timer state
│           ├── App.tsx             # Main app component
│           └── main.tsx            # React entry point
├── web/                     # Next.js web interface for reports
│   ├── src/
│   │   ├── app/
│   │   │   ├── report/[reportId]/  # Dynamic report pages
│   │   │   └── ...                 # Other pages
│   │   └── lib/                    # Shared utilities
│   └── package.json                # Web app dependencies
├── dist/                    # Built files
├── release/                # Distribution packages
└── docs/                   # Documentation
```

## Database Setup

⚠️ **IMPORTANT**: Before using the app, you must set up the database schema in Supabase.

### Quick Setup:
1. Open your Supabase project's SQL Editor
2. Copy the entire content from `database-schema.sql` 
3. Paste and run the SQL script
4. Verify tables are created successfully

See `DATABASE_SETUP.md` for detailed instructions.

### Database Structure:
- **work_sessions**: Stores all timed work sessions
- **user_preferences**: Stores user settings (daily goals, theme, etc.)
- **Row Level Security**: Users can only access their own data
- **Automatic timestamps**: Created/updated times tracked automatically

## Usage Guide

### 1. First Time Setup
1. Launch the app
2. Create an account with your email and password
3. Set your daily work goal (default: 6 hours)

### 2. Tracking Time
1. Navigate to the Timer tab
2. Enter what you're working on in the task field
3. Click "Start Timer" to begin tracking
4. Use "Pause" to temporarily stop, "Stop" to end the session
5. Sessions are automatically saved to your dashboard

### 3. Viewing Progress
- **Dashboard**: See today's total time and recent sessions
- **Analytics**: View weekly patterns and task breakdowns
- **Settings**: Adjust preferences and export data

### 4. Keyboard Shortcuts
- `Space`: Start/Stop timer
- `Cmd/Ctrl + P`: Pause timer
- `Cmd/Ctrl + ,`: Open settings

## Development

### Architecture Decisions
- **Electron + React**: Provides native desktop experience with modern web technologies
- **TypeScript**: Type safety for better development experience and fewer runtime errors
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Supabase**: Managed PostgreSQL with built-in authentication
- **Zustand**: Lightweight state management without boilerplate

### Code Style
- ESLint + TypeScript for code quality
- Prettier for consistent formatting
- Functional components with hooks
- Custom hook patterns for reusable logic

### Testing Strategy
- Unit tests for utility functions
- Integration tests for timer functionality
- E2E tests for critical user flows (planned)

## Building for Production

### macOS
```bash
npm run build:mac
```
Creates a `.dmg` file in the `release/` directory.

### Windows
```bash
npm run build:win
```
Creates an `.exe` installer in the `release/` directory.

### Cross-platform
```bash
npm run build:all
```
Builds for both macOS and Windows (requires appropriate build environment).

## Deployment

The built applications are unsigned and suitable for development and testing. For production distribution:

1. **macOS**: Sign with Apple Developer certificate and notarize
2. **Windows**: Sign with a code signing certificate
3. **Distribution**: Use appropriate channels (Mac App Store, direct download, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Build Errors**
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript compilation: `npm run type-check`

**Database Connection**
- Verify internet connection
- Check Supabase project status
- Ensure API keys are correct

**Electron Issues**
- Clear Electron cache: `npx electron-builder clean`
- Rebuild native modules: `npm rebuild`

### Development Mode Issues
- If hot reload isn't working, restart the dev server
- Check that both Vite (port 5173) and Electron are running
- Verify no port conflicts exist

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- UI inspiration from Linear, Raycast, and Arc Browser
- Built with Electron, React, and Supabase
- Icons from Lucide React
- Styling with Tailwind CSS and Radix UI