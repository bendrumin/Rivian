# Deployment Guide

This guide will walk you through deploying the Rivian News Tracker to Supabase and Vercel.

## 🚀 Deployment Steps

### 1. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Set up the Database**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Run migrations
   supabase db push
   ```

3. **Configure Environment Variables**
   - In your Supabase dashboard, go to Settings > API
   - Copy your database URL and API keys
   - Update your `.env.local` file:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   ```

### 2. Vercel Deployment

1. **Connect to GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `rivian-news` project

2. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=https://your-app.vercel.app
   RIVIAN_SUPPORT_BASE_URL=https://rivian.com/support
   SCOUT_SUPPORT_BASE_URL=https://scoutmotors.com/support
   SCRAPE_DELAY_MS=1000
   MAX_CONCURRENT_SCRAPES=3
   ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Your app will be available at `https://your-app.vercel.app`

### 3. Post-Deployment Setup

1. **Run Initial Scraping**
   ```bash
   # Access your deployed app's admin dashboard
   https://your-app.vercel.app/admin
   
   # Or trigger via API
   curl -X POST https://your-app.vercel.app/api/scrape \
     -H "Content-Type: application/json" \
     -d '{"jobType": "RIVIAN_SUPPORT"}'
   ```

2. **Set up Cron Jobs (Optional)**
   - Use Vercel Cron Jobs or external services like cron-job.org
   - Set up regular scraping intervals:
     - Rivian Support: Every 30 minutes
     - News Scraping: Every hour
     - Staging Discovery: Every 15 minutes

## 🔧 Configuration

### Supabase Configuration

The `supabase/config.toml` file contains all the necessary configuration for local development and deployment.

### Vercel Configuration

The `vercel.json` file optimizes the deployment for Vercel with:
- Proper function timeouts
- Environment variable mapping
- Build optimization

## 📊 Monitoring

### Supabase Dashboard
- Monitor database performance
- View API usage
- Check authentication logs

### Vercel Dashboard
- Monitor deployment status
- View function logs
- Check performance metrics

### Application Monitoring
- Access admin dashboard at `/admin`
- Monitor scraping jobs
- View system statistics

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase project status
   - Ensure database is not paused

2. **Scraping Failures**
   - Check rate limiting
   - Verify target URLs are accessible
   - Review error logs in admin dashboard

3. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Review build logs in Vercel

### Support

- Check the application logs in Vercel dashboard
- Review Supabase logs for database issues
- Use the admin dashboard for application monitoring

## 🔄 Updates

To update your deployment:

1. **Code Changes**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. **Database Changes**
   ```bash
   # Update Prisma schema
   npx prisma db push
   
   # Generate new migration
   npx prisma migrate dev --name update_description
   ```

3. **Environment Changes**
   - Update environment variables in Vercel dashboard
   - Redeploy if necessary

## 📈 Scaling

### Performance Optimization
- Enable Vercel Edge Functions for better performance
- Use Supabase connection pooling
- Implement caching strategies

### Cost Management
- Monitor Supabase usage
- Optimize scraping frequency
- Use Vercel's free tier efficiently

---

Your Rivian News Tracker is now ready for production! 🎉
