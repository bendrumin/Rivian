'use client'

import { useState } from 'react'
import { ScrapingJobs } from '@/components/scraping-jobs'
import { JobControls } from '@/components/job-controls'
import { ContentManagement } from '@/components/content-management'
import { Settings } from '@/components/settings'
import { Play, Database, Settings as SettingsIcon, BarChart3 } from 'lucide-react'

type TabType = 'jobs' | 'content' | 'analytics' | 'settings'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs')

  const tabs = [
    { id: 'jobs' as TabType, name: 'Scraping Jobs', icon: Play },
    { id: 'content' as TabType, name: 'Content Management', icon: Database },
    { id: 'analytics' as TabType, name: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, name: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage scraping jobs, content, and system settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-rivian-green text-rivian-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <JobControls />
              <ScrapingJobs />
            </div>
          )}

          {activeTab === 'content' && (
            <ContentManagement />
          )}

          {activeTab === 'analytics' && (
            <div className="card">
              <div className="card-content">
                <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-gray-500">
                  Analytics dashboard coming soon. Track scraping performance, 
                  content trends, and user engagement.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <Settings />
          )}
        </div>
      </div>
    </div>
  )
}
