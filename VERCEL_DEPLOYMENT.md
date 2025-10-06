# Vercel Deployment Guide

This guide will help you deploy the M-Tracker web version to Vercel for live sharing links.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner → "New repository"
3. Repository name: `m-tracker-app`
4. Description: `Cross-platform productivity task tracker with accountability sharing`
5. Make it **Public** (required for Vercel free tier)
6. Don't initialize with README (we already have files)
7. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, run these commands in your terminal (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/m-tracker-app.git

# Push the code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Find and select your `m-tracker-app` repository
5. Vercel will automatically detect it's a Vite project

### Configure Environment Variables

In the Vercel deployment settings, add these environment variables:

```
VITE_SUPABASE_URL=https://rdfclpbgvqgdnypcuzhr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZmNscGJndnFnZG55cGN1emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNzY0MTcsImV4cCI6MjA0Mzc1MjQxN30.YbwJxAQrB7vGVYLEBMmdPTGy-5B5WUpzGPV2RQWS_zo
```

### Build Configuration

Vercel should automatically detect the build settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build:web`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. You'll get a live URL like `https://m-tracker-app.vercel.app`

## Step 5: Update Sharing URLs

After deployment, your accountability sharing will work with the live Vercel URL instead of localhost. The app will automatically generate proper sharing links.

## Benefits of Vercel Deployment

✅ **Live Sharing Links**: Share reports with anyone, anywhere
✅ **Mobile Access**: Perfect viewing on phones and tablets  
✅ **Auto-Deploy**: Pushes to GitHub automatically trigger new deployments
✅ **Global CDN**: Fast loading worldwide
✅ **HTTPS**: Secure sharing links
✅ **Free Tier**: No cost for personal projects

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Look at build logs in Vercel dashboard

### Sharing Links Don't Work
- Ensure database schema is set up correctly
- Check that Supabase RLS policies allow public access to shared reports
- Verify the `shared_reports` table exists

### Database Connection Issues
- Make sure Supabase project is active
- Check environment variables are correct
- Verify API keys haven't expired

## Next Steps

Once deployed:
1. Test the sharing functionality with the live URL
2. Share your accountability reports with partners
3. Monitor usage in Vercel dashboard
4. Set up custom domain if desired (optional)

Your M-Tracker app will now have professional sharing capabilities perfect for accountability partnerships!