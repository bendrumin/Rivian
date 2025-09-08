# Rivian News & Support Tracker

A comprehensive Next.js 14 application that aggregates Rivian and Scout news, rumors, and tracks support documentation changes. Features exclusive staging content discovery and real-time change tracking.

## 🚀 Features

### Core Functionality
- **News Aggregation**: Scrape and track news from multiple sources
- **Staging Content Discovery**: Use Rivian's support search with "*" query to find unreleased content
- **Change Detection**: Track when support articles are updated, added, or removed
- **Full-text Search**: Search across all content with filters
- **RSS Feeds**: Generate RSS feeds for different content categories
- **Admin Dashboard**: Manage scraping jobs and content

### Unique Features
- **Staging Detection**: Automatically identify unreleased content using pattern matching
- **Content Change Tracking**: Detailed diff tracking for support documentation
- **Real-time Monitoring**: Continuous scraping with configurable intervals
- **Exclusive Previews**: Get early access to content before public release

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Web Scraping**: Cheerio and Axios
- **Deployment**: Vercel-ready

## 📊 Database Schema

### Models
- **Article**: News/rumors/blogs with categories, tags, staging flags
- **SupportArticle**: Rivian/Scout support docs with change tracking
- **ContentChange**: Track what changed in support articles
- **ScrapingJob**: Monitor scraping operations

### Enums
- **Brand**: RIVIAN, SCOUT
- **ArticleCategory**: NEWS, RUMOR, BLOG, OFFICIAL_UPDATE, REVIEW, ANALYSIS
- **ChangeType**: CREATED, UPDATED, DELETED, CONTENT_CHANGED, TITLE_CHANGED
- **JobStatus**: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED

## 🏗 Project Structure

```
rivian-news/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── articles/      # Article management
│   │   ├── support-articles/ # Support article management
│   │   ├── scrape/        # Scraping triggers
│   │   ├── jobs/          # Job management
│   │   ├── search/        # Search functionality
│   │   └── feed/          # RSS feed generation
│   ├── admin/             # Admin dashboard
│   ├── search/            # Search page
│   ├── staging/           # Staging alerts page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── header.tsx         # Navigation header
│   ├── footer.tsx         # Site footer
│   ├── article-card.tsx   # Article display component
│   ├── staging-alert.tsx  # Staging content alert
│   ├── search-bar.tsx     # Search interface
│   ├── latest-news.tsx    # News feed component
│   ├── staging-alerts.tsx # Staging alerts feed
│   ├── stats-overview.tsx # Statistics display
│   ├── job-controls.tsx   # Admin job controls
│   ├── scraping-jobs.tsx  # Job status display
│   ├── content-management.tsx # Content management
│   └── settings.tsx       # Admin settings
├── lib/                   # Utility libraries
│   ├── db.ts             # Database client
│   ├── utils.ts          # Utility functions
│   └── scrapers/         # Scraping architecture
│       ├── types.ts      # Type definitions
│       ├── base-scraper.ts # Base scraper class
│       ├── rivian-support-scraper.ts # Rivian scraper
│       ├── news-scraper.ts # News scraper
│       └── scraping-scheduler.ts # Job scheduler
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── scripts/              # Utility scripts
    └── scrape.ts         # Manual scraping script
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rivian-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rivian_news"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   RIVIAN_SUPPORT_BASE_URL="https://rivian.com/support"
   SCOUT_SUPPORT_BASE_URL="https://scoutmotors.com/support"
   SCRAPE_DELAY_MS=1000
   MAX_CONCURRENT_SCRAPES=3
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Scraping Settings
- **Scrape Interval**: How often to run automatic scraping (default: 30 minutes)
- **Max Concurrent Scrapes**: Maximum simultaneous operations (default: 3)
- **Scrape Delay**: Delay between requests to avoid rate limiting (default: 1000ms)

### Staging Detection
The system uses pattern matching to identify staging content:
- Keywords: "staging", "draft", "preview", "test"
- Phrases: "coming soon", "not yet available", "under development"
- Indicators: "beta", "experimental", "pre-release"
- Placeholders: "lorem ipsum", "sample text"

## 📡 API Endpoints

### Articles
- `GET /api/articles` - List articles with filters
- `POST /api/articles` - Create new article
- `GET /api/articles/[id]` - Get specific article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Support Articles
- `GET /api/support-articles` - List support articles with filters

### Scraping
- `POST /api/scrape` - Trigger manual scraping job
- `GET /api/scrape` - Get scraping statistics

### Jobs
- `GET /api/jobs` - List recent scraping jobs
- `GET /api/jobs?jobId=[id]` - Get specific job status

### Search
- `GET /api/search?q=[query]&type=[type]` - Search content

### RSS Feeds
- `GET /api/feed/rss` - Main RSS feed
- `GET /api/feed/rss?type=staging` - Staging content feed
- `GET /api/feed/rss?category=OFFICIAL_UPDATE` - Official updates feed
- `GET /api/feed/rss?brand=RIVIAN` - Rivian-only feed

## 🎯 Usage

### Manual Scraping
```bash
# Run manual scraping script
npm run scrape

# Or trigger via API
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"jobType": "RIVIAN_SUPPORT"}'
```

### Admin Dashboard
Access the admin dashboard at `/admin` to:
- Trigger manual scraping jobs
- Monitor job status and history
- Manage content and settings
- View system statistics

### RSS Feeds
Subscribe to RSS feeds for automatic updates:
- All content: `/api/feed/rss`
- Staging only: `/api/feed/rss?type=staging`
- Official updates: `/api/feed/rss?category=OFFICIAL_UPDATE`

## 🔍 Staging Content Discovery

The system uses a unique approach to discover unreleased content:

1. **Wildcard Search**: Uses Rivian's support search with "*" query
2. **Pattern Matching**: Identifies staging indicators in content
3. **Change Tracking**: Monitors for updates and status changes
4. **Confidence Scoring**: Rates likelihood of staging content

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This project is not affiliated with Rivian or Scout Motors. It's an independent tool for tracking publicly available information and should be used responsibly and in accordance with website terms of service.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the admin dashboard for system status

---

**Built with ❤️ for the Rivian and Scout community**
