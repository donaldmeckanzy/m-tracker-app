# M-Tracker Web Interface

This is the web interface for viewing shared M-Tracker daily reports. It's deployed on Vercel and provides a public interface for viewing productivity reports shared by M-Tracker users.

## Features

- View shared daily productivity reports
- Beautiful, responsive design
- Automatic report expiration for privacy
- Real-time data from Supabase

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment

This app is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

Make sure to set the environment variables in your Vercel project settings.

## Usage

Users of the M-Tracker desktop app can generate shareable links that point to reports on this web interface. Reports automatically expire for privacy.