'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { ArticleCard } from '@/components/article-card'
import { StagingAlert } from '@/components/staging-alert'
import { ArticleCategory, Brand } from '@prisma/client'
import { Search, FileText, AlertTriangle } from 'lucide-react'

interface SearchResult {
  query: string
  articles: any[]
  supportArticles: any[]
  total: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'all'

  useEffect(() => {
    if (query) {
      performSearch(query, type)
    }
  }, [query, type])

  const performSearch = async (searchQuery: string, searchType: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <Search className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            {/* Search Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">
                Search Results for "{results.query}"
              </h2>
              <p className="text-gray-600">
                Found {results.total} results
                {results.articles.length > 0 && ` (${results.articles.length} articles`}
                {results.supportArticles.length > 0 && `, ${results.supportArticles.length} support articles`}
                {results.articles.length > 0 || results.supportArticles.length > 0 ? ')' : ''}
              </p>
            </div>

            {/* Articles */}
            {results.articles.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold">Articles</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      {...article}
                      publishedAt={new Date(article.publishedAt)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Support Articles */}
            {results.supportArticles.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="text-xl font-semibold">Support Articles</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.supportArticles.map((article) => (
                    <StagingAlert
                      key={article.id}
                      {...article}
                      lastUpdated={new Date(article.lastUpdated)}
                      changesCount={0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.total === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try different keywords or check your spelling.
                </p>
              </div>
            )}
          </div>
        )}

        {!query && !loading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for content</h3>
            <p className="text-gray-500">
              Enter a search term above to find articles, support documentation, and staging content.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
