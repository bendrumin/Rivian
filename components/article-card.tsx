'use client'

import Link from 'next/link'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import { ArticleCategory, Brand } from '@prisma/client'
import { ExternalLink, Eye, Calendar } from 'lucide-react'

interface ArticleCardProps {
  id: string
  title: string
  excerpt?: string
  url: string
  source: string
  category: ArticleCategory
  brand: Brand
  tags: string[]
  isStaging: boolean
  publishedAt: Date
  viewCount: number
}

export function ArticleCard({
  id,
  title,
  excerpt,
  url,
  source,
  category,
  brand,
  tags,
  isStaging,
  publishedAt,
  viewCount
}: ArticleCardProps) {
  const getCategoryColor = (category: ArticleCategory) => {
    switch (category) {
      case ArticleCategory.NEWS:
        return 'badge-news'
      case ArticleCategory.RUMOR:
        return 'badge-rumor'
      case ArticleCategory.OFFICIAL_UPDATE:
        return 'badge-official'
      default:
        return 'badge-news'
    }
  }

  const getBrandColor = (brand: Brand) => {
    return brand === Brand.RIVIAN ? 'badge-rivian' : 'badge-scout'
  }

  return (
    <article className="card hover:shadow-md transition-shadow">
      <div className="card-content">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${getBrandColor(brand)}`}>
              {brand}
            </span>
            <span className={`badge ${getCategoryColor(category)}`}>
              {category.replace('_', ' ')}
            </span>
            {isStaging && (
              <span className="badge badge-staging">
                Staging
              </span>
            )}
          </div>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="View original source"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link 
            href={`/articles/${id}`}
            className="hover:text-rivian-green transition-colors"
          >
            {title}
          </Link>
        </h2>

        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(excerpt, 150)}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(publishedAt)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{viewCount}</span>
            </span>
          </div>
          <span className="text-xs">
            via {source}
          </span>
        </div>
      </div>
    </article>
  )
}
