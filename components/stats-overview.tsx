'use client'

import { useEffect, useState } from 'react'
import { FileText, AlertTriangle, TrendingUp, Clock } from 'lucide-react'

interface Stats {
  totalArticles: number
  stagingArticles: number
  recentChanges: number
  lastScrape: string
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesResponse, supportResponse, jobsResponse] = await Promise.all([
          fetch('/api/articles?limit=1'),
          fetch('/api/support-articles?limit=1'),
          fetch('/api/scrape')
        ])

        const [articlesData, supportData, jobsData] = await Promise.all([
          articlesResponse.json(),
          supportResponse.json(),
          jobsResponse.json()
        ])

        setStats({
          totalArticles: articlesData.pagination?.total || 0,
          stagingArticles: supportData.pagination?.total || 0,
          recentChanges: 0, // This would need a separate API endpoint
          lastScrape: jobsData.recentJobs?.[0]?.completedAt || 'Never'
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-content">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Staging Content',
      value: stats.stagingArticles.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Recent Changes',
      value: stats.recentChanges.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Last Scrape',
      value: stats.lastScrape === 'Never' ? 'Never' : new Date(stats.lastScrape).toLocaleDateString(),
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
