'use client'

import { useState } from 'react'
import { ArticleCategory, Brand } from '@prisma/client'
import { Search, Filter, Trash2, Edit, Eye } from 'lucide-react'

export function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | ''>('')
  const [selectedBrand, setSelectedBrand] = useState<Brand | ''>('')
  const [showStagingOnly, setShowStagingOnly] = useState(false)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <h2 className="text-xl font-semibold mb-4">Content Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ArticleCategory | '')}
                className="input"
              >
                <option value="">All Categories</option>
                {Object.values(ArticleCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value as Brand | '')}
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

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showStagingOnly}
                  onChange={(e) => setShowStagingOnly(e.target.checked)}
                  className="rounded border-gray-300 text-rivian-green focus:ring-rivian-green"
                />
                <span className="ml-2 text-sm text-gray-700">Staging only</span>
              </label>
            </div>
          </div>

          <button className="btn btn-primary">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Articles</h3>
            <div className="text-sm text-gray-500">
              Showing 0 of 0 articles
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No articles found matching your criteria.</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search filters or run a scraping job to fetch new content.
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold mb-4">Bulk Actions</h3>
          <div className="flex space-x-4">
            <button className="btn btn-outline">
              <Eye className="h-4 w-4 mr-2" />
              View Selected
            </button>
            <button className="btn btn-outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Selected
            </button>
            <button className="btn btn-outline text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
