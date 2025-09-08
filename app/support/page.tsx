'use client'

import { useState, useEffect } from 'react'
import { StagingAlert } from '@/components/staging-alert'
import { Brand } from '@prisma/client'
import { Search, Filter, BookOpen } from 'lucide-react'

export default function SupportPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    search: '',
    isStaging: false,
    hasChanges: false
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [filters, page])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy: 'lastUpdated',
        sortOrder: 'desc'
      })

      if (filters.brand) params.append('brand', filters.brand)
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.isStaging) params.append('isStaging', 'true')
      if (filters.hasChanges) params.append('hasChanges', 'true')

      const response = await fetch(`/api/support-articles?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (page === 1) {
          setArticles(data.articles)
        } else {
          setArticles(prev => [...prev, ...data.articles])
        }
        setHasMore(data.pagination.page < data.pagination.pages)
      }
    } catch (error) {
      console.error('Failed to fetch support articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-rivian-green mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Support Documentation</h1>
          </div>
          <p className="text-lg text-gray-600">
            Browse Rivian and Scout support articles with change tracking and staging content detection.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search support articles..."
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="input"
                >
                  <option value="">All Brands</option>
                  {Object.values(Brand).map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  placeholder="e.g., vehicle, charging"
                  className="input"
                />
              </div>

              <div className="flex items-end space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isStaging}
                    onChange={(e) => handleFilterChange('isStaging', e.target.checked)}
                    className="rounded border-gray-300 text-rivian-green focus:ring-rivian-green"
                  />
                  <span className="ml-2 text-sm text-gray-700">Staging only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasChanges}
                    onChange={(e) => handleFilterChange('hasChanges', e.target.checked)}
                    className="rounded border-gray-300 text-rivian-green focus:ring-rivian-green"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has changes</span>
                </label>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ brand: '', category: '', search: '', isStaging: false, hasChanges: false })
                    setPage(1)
                  }}
                  className="btn btn-outline w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="card-content">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <StagingAlert
                  key={article.id}
                  {...article}
                  lastUpdated={new Date(article.lastUpdated)}
                  changesCount={article.changes?.length || 0}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No support articles found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
