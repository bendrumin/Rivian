#!/usr/bin/env tsx

import { RealScraper } from '../lib/scrapers/real-scraper'
import { ScrapingScheduler } from '../lib/scrapers/scraping-scheduler'

async function main() {
  const args = process.argv.slice(2)
  const jobType = args[0] || 'all'

  console.log('🚀 Starting Rivian News Scraper...')
  console.log(`📋 Job type: ${jobType}`)

  try {
    const scraper = new RealScraper('https://rivian.com/support')
    
    switch (jobType) {
      case 'rivian-support':
        console.log('🔍 Scraping Rivian support articles...')
        const supportResult = await scraper.scrapeRivianSupport()
        console.log('✅ Support scraping completed:', supportResult)
        break

      case 'news':
        console.log('📰 Scraping news articles...')
        const newsResult = await scraper.scrapeNews()
        console.log('✅ News scraping completed:', newsResult)
        break

      case 'staging':
        console.log('🔍 Discovering staging content...')
        const stagingResult = await scraper.scrapeRivianSupport()
        console.log('✅ Staging discovery completed:', stagingResult)
        break

      case 'all':
        console.log('🔄 Running all scraping jobs...')
        const scheduler = new ScrapingScheduler()
        
        // Run all job types
        const jobs = [
          scheduler.triggerManualScrape('RIVIAN_SUPPORT' as any),
          scheduler.triggerManualScrape('NEWS_SCRAPE' as any),
          scheduler.triggerManualScrape('STAGING_DISCOVERY' as any)
        ]
        
        const results = await Promise.allSettled(jobs)
        console.log('✅ All scraping jobs completed:', results)
        break

      default:
        console.error('❌ Unknown job type:', jobType)
        console.log('Available job types: rivian-support, news, staging, all')
        process.exit(1)
    }

    console.log('🎉 Scraping completed successfully!')
  } catch (error) {
    console.error('❌ Scraping failed:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  process.exit(0)
})

main().catch((error) => {
  console.error('💥 Unhandled error:', error)
  process.exit(1)
})
