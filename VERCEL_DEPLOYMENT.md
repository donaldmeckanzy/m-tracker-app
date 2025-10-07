# Vercel Deployment Instructions

## Automatic Deployment Setup

Your M-Tracker web interface is now ready for deployment on Vercel. Since your GitHub repository syncs automatically with Vercel, follow these steps:

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `donaldmeckanzy/m-tracker-app`
4. Configure the project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://rdfclpbgvqgdnypcuzhr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZmNscGJndnFnZG55cGN1emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNzY0MTcsImV4cCI6MjA0Mzc1MjQxN30.YbwJxAQrB7vGVYLEBMmdPTGy-5B5WUpzGPV2RQWS_zo
```

### 3. Domain Configuration

Your app will be deployed to:
- Production: `https://m-tracker-app.vercel.app`
- Preview: `https://m-tracker-app-git-main-donaldmeckanzy.vercel.app`

### 4. Testing the Deployment

1. Generate a daily report in your M-Tracker desktop app
2. Copy the shareable link
3. Open the link in a browser
4. Verify the report displays correctly

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the web directory
cd web
vercel --prod
```

## Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches

## Domain Setup (Optional)

To use a custom domain:
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update the `VITE_WEB_BASE_URL` in your desktop app accordingly

## Monitoring

Monitor your deployment:
- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Functions → View Function Logs
- **Performance**: Built-in Web Vitals tracking

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that root directory is set to `web`
2. **Environment Variables**: Ensure Supabase keys are correctly set
3. **404 Errors**: Verify routing configuration in `vercel.json`
4. **Database Errors**: Check Supabase project status and RLS policies

### Debug Commands:

```bash
# Test build locally
cd web
npm run build

# Test production build
npm start

# Check deployment logs
vercel logs your-deployment-url
```

## Success Criteria

✅ Deployment successful when:
- Home page loads at your Vercel URL
- Report pages work: `/report/[reportId]`
- Desktop app generates working links
- Reports display with proper styling
- Mobile responsiveness works

## Next Steps

1. Deploy to Vercel following the steps above
2. Test the integration with your desktop app
3. Share the link with accountability partners
4. Monitor usage through Vercel analytics

Your M-Tracker daily sharing feature is now complete with a live web interface! 🎉