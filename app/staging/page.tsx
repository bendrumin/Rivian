import { Suspense } from 'react'
import { StagingAlerts } from '@/components/staging-alerts'
import { AlertTriangle, Eye, Clock } from 'lucide-react'

export default function StagingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Staging Content Alerts</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Exclusive previews of unreleased Rivian and Scout content. We continuously monitor 
            support systems for staging content that may not be publicly available yet.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="card-content">
              <div className="flex items-center mb-2">
                <Eye className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800">Exclusive Access</h3>
              </div>
              <p className="text-sm text-yellow-700">
                Get early access to content that may not be publicly available yet.
              </p>
            </div>
          </div>

          <div className="card bg-blue-50 border-blue-200">
            <div className="card-content">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Real-time Monitoring</h3>
              </div>
              <p className="text-sm text-blue-700">
                Our system continuously scans for new staging content every 15 minutes.
              </p>
            </div>
          </div>

          <div className="card bg-green-50 border-green-200">
            <div className="card-content">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Change Tracking</h3>
              </div>
              <p className="text-sm text-green-700">
                Track when staging content is updated, moved, or published.
              </p>
            </div>
          </div>
        </div>

        {/* Staging Alerts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Staging Content</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse border-l-4 border-l-yellow-400 bg-yellow-50">
                  <div className="card-content">
                    <div className="h-4 bg-yellow-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-yellow-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-yellow-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <StagingAlerts />
          </Suspense>
        </div>

        {/* RSS Feed Link */}
        <div className="mt-12 text-center">
          <div className="card bg-gray-50">
            <div className="card-content">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-4">
                Subscribe to our RSS feed to get notified of new staging content automatically.
              </p>
              <a
                href="/api/feed/rss?type=staging"
                className="btn btn-primary"
              >
                Subscribe to Staging RSS Feed
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
