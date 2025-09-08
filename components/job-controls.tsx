'use client'

import { useState } from 'react'
import { JobType } from '@prisma/client'
import { Play, Loader2 } from 'lucide-react'

export function JobControls() {
  const [loading, setLoading] = useState<JobType | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const jobTypes = [
    { type: JobType.RIVIAN_SUPPORT, label: 'Rivian Support Scrape', description: 'Scrape Rivian support articles and detect changes' },
    { type: JobType.NEWS_SCRAPE, label: 'News Scrape', description: 'Scrape news articles from various sources' },
    { type: JobType.STAGING_DISCOVERY, label: 'Staging Discovery', description: 'Discover unreleased staging content' },
    { type: JobType.CONTENT_UPDATE, label: 'Content Update Check', description: 'Check for content changes and updates' },
  ]

  const triggerJob = async (jobType: JobType) => {
    setLoading(jobType)
    setMessage(null)

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobType }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Job started successfully! Job ID: ${data.jobId}`
        })
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to start job'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error occurred'
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="text-xl font-semibold mb-4">Manual Job Triggers</h2>
        <p className="text-gray-600 mb-6">
          Manually trigger scraping jobs to update content immediately.
        </p>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobTypes.map((job) => (
            <div key={job.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{job.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                </div>
                <button
                  onClick={() => triggerJob(job.type)}
                  disabled={loading === job.type}
                  className="btn btn-primary ml-4"
                >
                  {loading === job.type ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
