#!/usr/bin/env tsx

import { RivianSupportScraper } from '../lib/scrapers/rivian-support-scraper'
import { NewsScraper } from '../lib/scrapers/news-scraper'
import { ScrapingScheduler } from '../lib/scrapers/scraping-scheduler'

async function main() {
  const args = process.argv.slice(2)
  const jobType = args[0] || 'all'

  console.log('🚀 Starting Rivian News Scraper...')
  console.log(`📋 Job type: ${jobType}`)

  try {
    switch (jobType) {
      case 'rivian-support':
        console.log('🔍 Scraping Rivian support articles...')
        const supportScraper = new RivianSupportScraper()
        const supportResult = await supportScraper.scrape()
        console.log('✅ Support scraping completed:', supportResult)
        break

      case 'news':
        console.log('📰 Scraping news articles...')
        const newsScraper = new NewsScraper()
        const newsResult = await newsScraper.scrape()
        console.log('✅ News scraping completed:', newsResult)
        break

      case 'staging':
        console.log('🔍 Discovering staging content...')
        const stagingScraper = new RivianSupportScraper()
        const stagingResult = await stagingScraper.scrape()
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
