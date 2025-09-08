'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { Brand } from '@prisma/client'
import { AlertTriangle, ExternalLink, Eye } from 'lucide-react'

interface StagingAlertProps {
  id: string
  title: string
  url: string
  brand: Brand
  category?: string
  lastUpdated: Date
  changesCount: number
}

export function StagingAlert({
  id,
  title,
  url,
  brand,
  category,
  lastUpdated,
  changesCount
}: StagingAlertProps) {
  const getBrandColor = (brand: Brand) => {
    return brand === Brand.RIVIAN ? 'badge-rivian' : 'badge-scout'
  }

  return (
    <div className="card border-l-4 border-l-yellow-400 bg-yellow-50">
      <div className="card-content">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="badge badge-staging">
              Staging Content
            </span>
            <span className={`badge ${getBrandColor(brand)}`}>
              {brand}
            </span>
            {category && (
              <span className="badge bg-gray-100 text-gray-700">
                {category}
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

        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          <Link 
            href={`/support/${id}`}
            className="hover:text-rivian-green transition-colors"
          >
            {title}
          </Link>
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              Last updated {formatRelativeTime(lastUpdated)}
            </span>
            {changesCount > 0 && (
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{changesCount} recent changes</span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 p-3 bg-yellow-100 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Exclusive Preview:</strong> This content appears to be in staging or development. 
            It may not be publicly available yet and could change before official release.
          </p>
        </div>
      </div>
    </div>
  )
}
