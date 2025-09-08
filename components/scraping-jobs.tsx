'use client'

import { useEffect, useState } from 'react'
import { JobStatus, JobType } from '@prisma/client'
import { Clock, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface Job {
  id: string
  jobType: JobType
  status: JobStatus
  startedAt: string | null
  completedAt: string | null
  error: string | null
  metadata: any
  createdAt: string
}

export function ScrapingJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=20')
        if (response.ok) {
          const data = await response.json()
          setJobs(data)
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchJobs, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />
      case JobStatus.RUNNING:
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case JobStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case JobStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />
      case JobStatus.CANCELLED:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case JobStatus.RUNNING:
        return 'bg-blue-100 text-blue-800'
      case JobStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case JobStatus.FAILED:
        return 'bg-red-100 text-red-800'
      case JobStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatJobType = (jobType: JobType) => {
    return jobType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="text-xl font-semibold mb-4">Recent Scraping Jobs</h2>
        
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No jobs found</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <span className="font-medium">{formatJobType(job.jobType)}</span>
                    <span className={`badge ${getStatusColor(job.status)}`}>
                      {job.status.toLowerCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(new Date(job.createdAt))}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Job ID:</strong> {job.id}
                  </div>
                  {job.startedAt && (
                    <div>
                      <strong>Started:</strong> {formatRelativeTime(new Date(job.startedAt))}
                    </div>
                  )}
                  {job.completedAt && (
                    <div>
                      <strong>Completed:</strong> {formatRelativeTime(new Date(job.completedAt))}
                    </div>
                  )}
                  {job.error && (
                    <div className="text-red-600">
                      <strong>Error:</strong> {job.error}
                    </div>
                  )}
                  {job.metadata && (
                    <div>
                      <strong>Results:</strong> {JSON.stringify(job.metadata, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
