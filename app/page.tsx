import { Suspense } from 'react'
import { SearchBar } from '@/components/search-bar'
import { LatestNews } from '@/components/latest-news'
import { StagingAlerts } from '@/components/staging-alerts'
import { StatsOverview } from '@/components/stats-overview'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Rivian News & Support Tracker
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track Rivian and Scout news, rumors, and support documentation changes. 
              Get exclusive previews of unreleased content and stay updated with the latest developments.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading stats...</div>}>
            <StatsOverview />
          </Suspense>
        </div>
      </section>

      {/* Staging Alerts */}
      <section className="py-12 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Staging Content Alerts
            </h2>
            <p className="text-lg text-gray-600">
              Exclusive previews of unreleased Rivian and Scout content
            </p>
          </div>
          <Suspense fallback={<div>Loading staging alerts...</div>}>
            <StagingAlerts />
          </Suspense>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest News & Updates
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed with the latest Rivian and Scout developments
            </p>
          </div>
          <Suspense fallback={<div>Loading latest news...</div>}>
            <LatestNews />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
