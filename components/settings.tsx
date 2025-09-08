'use client'

import { useState } from 'react'
import { Save, RefreshCw, Database, Clock, Globe } from 'lucide-react'

export function Settings() {
  const [settings, setSettings] = useState({
    scrapeInterval: 30,
    maxConcurrentScrapes: 3,
    scrapeDelay: 1000,
    enableStagingDetection: true,
    enableChangeTracking: true,
    enableRSSFeeds: true,
    enableNotifications: false,
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save settings'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      scrapeInterval: 30,
      maxConcurrentScrapes: 3,
      scrapeDelay: 1000,
      enableStagingDetection: true,
      enableChangeTracking: true,
      enableRSSFeeds: true,
      enableNotifications: false,
    })
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Scraping Settings */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center mb-4">
            <RefreshCw className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold">Scraping Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scrape Interval (minutes)
              </label>
              <input
                type="number"
                value={settings.scrapeInterval}
                onChange={(e) => setSettings({ ...settings, scrapeInterval: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="1440"
              />
              <p className="text-xs text-gray-500 mt-1">
                How often to run automatic scraping jobs
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Concurrent Scrapes
              </label>
              <input
                type="number"
                value={settings.maxConcurrentScrapes}
                onChange={(e) => setSettings({ ...settings, maxConcurrentScrapes: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of simultaneous scraping operations
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scrape Delay (ms)
              </label>
              <input
                type="number"
                value={settings.scrapeDelay}
                onChange={(e) => setSettings({ ...settings, scrapeDelay: parseInt(e.target.value) })}
                className="input"
                min="100"
                max="10000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Delay between requests to avoid rate limiting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Settings */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold">Feature Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Staging Detection</h3>
                <p className="text-sm text-gray-500">
                  Automatically detect unreleased staging content
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableStagingDetection}
                  onChange={(e) => setSettings({ ...settings, enableStagingDetection: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rivian-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rivian-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Change Tracking</h3>
                <p className="text-sm text-gray-500">
                  Track changes in support documentation
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableChangeTracking}
                  onChange={(e) => setSettings({ ...settings, enableChangeTracking: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rivian-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rivian-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">RSS Feeds</h3>
                <p className="text-sm text-gray-500">
                  Generate RSS feeds for different content categories
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableRSSFeeds}
                  onChange={(e) => setSettings({ ...settings, enableRSSFeeds: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rivian-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rivian-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">
                  Send notifications for new staging content
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rivian-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rivian-green"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="btn btn-outline"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}
