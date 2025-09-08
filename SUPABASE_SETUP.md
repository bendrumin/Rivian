# Supabase Setup Guide

## 🎯 Your Supabase Project Details

- **Project URL**: https://npyovadmjolgxlayhsnc.supabase.co
- **Project ID**: npyovadmjolgxlayhsnc
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weW92YWRtam9sZ3hsYXloc25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyOTU3NDMsImV4cCI6MjA3Mjg3MTc0M30.nshOLk8BGlqd-WwQWECpiF3xylyIBicVTF7VHHMrs-0
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weW92YWRtam9sZ3hsYXloc25jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI5NTc0MywiZXhwIjoyMDcyODcxNzQzfQ.SuwDCz89WFxjasraXddG7o536V5y31Vf1yW6QKJAotk

## 🚀 Quick Setup Steps

### 1. Get Your Database Password
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/npyovadmjolgxlayhsnc)
2. Navigate to **Settings > Database**
3. Copy your database password

### 2. Create Environment File
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local and replace [YOUR-PASSWORD] with your actual database password
```

### 3. Set Up Database Schema
```bash
# Push the database schema to Supabase
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

## 🔧 Environment Variables for Vercel

When deploying to Vercel, use these environment variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.npyovadmjolgxlayhsnc.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://npyovadmjolgxlayhsnc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weW92YWRtam9sZ3hsYXloc25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyOTU3NDMsImV4cCI6MjA3Mjg3MTc0M30.nshOLk8BGlqd-WwQWECpiF3xylyIBicVTF7VHHMrs-0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weW92YWRtam9sZ3hsYXloc25jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI5NTc0MywiZXhwIjoyMDcyODcxNzQzfQ.SuwDCz89WFxjasraXddG7o536V5y31Vf1yW6QKJAotk
NEXTAUTH_SECRET=rivian-news-secret-key-2024
NEXTAUTH_URL=https://your-app.vercel.app
RIVIAN_SUPPORT_BASE_URL=https://rivian.com/support
SCOUT_SUPPORT_BASE_URL=https://scoutmotors.com/support
SCRAPE_DELAY_MS=1000
MAX_CONCURRENT_SCRAPES=3
```

## 📊 Database Tables

Your Supabase database will have these tables:
- `articles` - News and blog articles
- `support_articles` - Rivian/Scout support documentation
- `content_changes` - Track changes in support articles
- `scraping_jobs` - Monitor scraping operations

## 🔍 Monitoring

- **Supabase Dashboard**: https://supabase.com/dashboard/project/npyovadmjolgxlayhsnc
- **Database**: Monitor queries and performance
- **API**: View API usage and logs
- **Auth**: Manage authentication (if needed)

## 🚨 Troubleshooting

### Database Connection Issues
- Verify your database password in `.env.local`
- Check that your Supabase project is not paused
- Ensure the DATABASE_URL is correctly formatted

### Schema Issues
- Run `npx prisma db push` to sync schema
- Check Supabase logs for any errors
- Verify all environment variables are set

## ✅ Ready for Vercel!

Once your local setup is working:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables above
4. Deploy!

Your Rivian News Tracker will be live and ready to start monitoring for staging content! 🚗⚡
