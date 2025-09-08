import { NextRequest, NextResponse } from 'next/server'
import { ScrapingScheduler } from '@/lib/scrapers/scraping-scheduler'
import { JobType } from '@prisma/client'

const scheduler = new ScrapingScheduler()

export async function POST(request: NextRequest) {
  try {
    const { jobType } = await request.json()

    if (!jobType || !Object.values(JobType).includes(jobType)) {
      return NextResponse.json(
        { error: 'Invalid job type' },
        { status: 400 }
      )
    }

    const jobId = await scheduler.triggerManualScrape(jobType as JobType)

    return NextResponse.json({
      success: true,
      jobId,
      message: `Scraping job ${jobType} started`
    })
  } catch (error) {
    console.error('Failed to start scraping job:', error)
    return NextResponse.json(
      { error: 'Failed to start scraping job' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await scheduler.getJobStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to get job stats:', error)
    return NextResponse.json(
      { error: 'Failed to get job stats' },
      { status: 500 }
    )
  }
}
