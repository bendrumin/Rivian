'use client'

import { useEffect, useState } from 'react'
import { StagingAlert } from './staging-alert'
import { Brand } from '@prisma/client'

interface StagingArticle {
  id: string
  title: string
  url: string
  brand: Brand
  category?: string
  lastUpdated: string
  changes: Array<{
    id: string
    changeType: string
    detectedAt: string
  }>
}

export function StagingAlerts() {
  const [articles, setArticles] = useState<StagingArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStagingArticles = async () => {
      try {
        const response = await fetch('/api/support-articles?isStaging=true&limit=6&sortBy=lastUpdated&sortOrder=desc')
        if (!response.ok) {
          throw new Error('Failed to fetch staging articles')
        }
        const data = await response.json()
        setArticles(data.articles)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStagingArticles()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse border-l-4 border-l-yellow-400 bg-yellow-50">
            <div className="card-content">
              <div className="h-4 bg-yellow-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-yellow-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-yellow-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading staging alerts: {error}</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <p className="text-gray-500 mb-4">No staging content detected at the moment.</p>
          <p className="text-sm text-gray-400">
            We continuously monitor Rivian's support system for unreleased content. 
            Check back later for exclusive previews!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <StagingAlert
          key={article.id}
          {...article}
          lastUpdated={new Date(article.lastUpdated)}
          changesCount={article.changes.length}
        />
      ))}
    </div>
  )
}
