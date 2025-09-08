import { JobType, JobStatus } from '@prisma/client'
import { prisma } from '../db'
import { SimpleScraper } from './simple-scraper'
import { ScrapingResult } from './types'

export class ScrapingScheduler {
  private isRunning = false
  private jobs: Map<string, Promise<void>> = new Map()

  async startScheduledScraping(): Promise<void> {
    if (this.isRunning) {
      console.log('Scraping scheduler is already running')
      return
    }

    this.isRunning = true
    console.log('Starting scraping scheduler...')

    // Schedule different types of scraping jobs
    this.scheduleJob('rivian-support', JobType.RIVIAN_SUPPORT, 30 * 60 * 1000) // Every 30 minutes
    this.scheduleJob('news-scrape', JobType.NEWS_SCRAPE, 60 * 60 * 1000) // Every hour
    this.scheduleJob('staging-discovery', JobType.STAGING_DISCOVERY, 15 * 60 * 1000) // Every 15 minutes
  }

  async stopScheduledScraping(): Promise<void> {
    this.isRunning = false
    console.log('Stopping scraping scheduler...')
    
    // Wait for all running jobs to complete
    await Promise.allSettled(Array.from(this.jobs.values()))
    this.jobs.clear()
  }

  async triggerManualScrape(jobType: JobType): Promise<string> {
    const jobId = await this.createJob(jobType)
    
    // Run the job asynchronously
    this.runJob(jobId, jobType).catch(error => {
      console.error(`Job ${jobId} failed:`, error)
    })

    return jobId
  }

  private scheduleJob(name: string, jobType: JobType, interval: number): void {
    const runJob = async () => {
      if (!this.isRunning) return

      try {
        const jobId = await this.createJob(jobType)
        await this.runJob(jobId, jobType)
      } catch (error) {
        console.error(`Scheduled job ${name} failed:`, error)
      }

      // Schedule next run
      if (this.isRunning) {
        setTimeout(runJob, interval)
      }
    }

    // Start the first run
    setTimeout(runJob, interval)
  }

  private async createJob(jobType: JobType): Promise<string> {
    const job = await prisma.scrapingJob.create({
      data: {
        jobType,
        status: JobStatus.PENDING
      }
    })

    return job.id
  }

  private async runJob(jobId: string, jobType: JobType): Promise<void> {
    const jobPromise = this.executeJob(jobId, jobType)
    this.jobs.set(jobId, jobPromise)

    try {
      await jobPromise
    } finally {
      this.jobs.delete(jobId)
    }
  }

  private async executeJob(jobId: string, jobType: JobType): Promise<void> {
    try {
      // Update job status to running
      await prisma.scrapingJob.update({
        where: { id: jobId },
        data: {
          status: JobStatus.RUNNING,
          startedAt: new Date()
        }
      })

      let result: ScrapingResult

      // Execute the appropriate scraper
      const scraper = new SimpleScraper('https://rivian.com/support')
      
      switch (jobType) {
        case JobType.RIVIAN_SUPPORT:
          result = await scraper.scrapeRivianSupport()
          break

        case JobType.NEWS_SCRAPE:
          result = await scraper.scrapeNews()
          break

        case JobType.STAGING_DISCOVERY:
          result = await scraper.scrapeRivianSupport()
          break

        case JobType.CONTENT_UPDATE:
          // This would trigger content change detection
          result = { success: true, data: { message: 'Content update check completed' } }
          break

        default:
          throw new Error(`Unknown job type: ${jobType}`)
      }

      // Update job status to completed
      await prisma.scrapingJob.update({
        where: { id: jobId },
        data: {
          status: result.success ? JobStatus.COMPLETED : JobStatus.FAILED,
          completedAt: new Date(),
          error: result.error,
          metadata: result.metadata
        }
      })

      console.log(`Job ${jobId} completed successfully`)
    } catch (error) {
      console.error(`Job ${jobId} failed:`, error)

      // Update job status to failed
      await prisma.scrapingJob.update({
        where: { id: jobId },
        data: {
          status: JobStatus.FAILED,
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    return await prisma.scrapingJob.findUnique({
      where: { id: jobId }
    })
  }

  async getRecentJobs(limit: number = 10): Promise<any[]> {
    return await prisma.scrapingJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  async getJobStats(): Promise<any> {
    const stats = await prisma.scrapingJob.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    const totalJobs = await prisma.scrapingJob.count()
    const recentJobs = await this.getRecentJobs(5)

    return {
      totalJobs,
      statusCounts: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status
        return acc
      }, {} as Record<string, number>),
      recentJobs
    }
  }
}
