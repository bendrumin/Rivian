import { NextRequest, NextResponse } from 'next/server'
import { ScrapingScheduler } from '@/lib/scrapers/scraping-scheduler'

const scheduler = new ScrapingScheduler()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const jobId = searchParams.get('jobId')

    if (jobId) {
      const job = await scheduler.getJobStatus(jobId)
      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(job)
    }

    const jobs = await scheduler.getRecentJobs(limit)
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Failed to get jobs:', error)
    return NextResponse.json(
      { error: 'Failed to get jobs' },
      { status: 500 }
    )
  }
}
