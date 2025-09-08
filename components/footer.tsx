import Link from 'next/link'
import { Car, Wrench, Rss, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                <Car className="h-8 w-8 text-rivian-green" />
                <Wrench className="h-6 w-6 text-rivian-green" />
              </div>
              <span className="text-xl font-bold">Rivian News Tracker</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Track Rivian and Scout news, rumors, and support documentation changes. 
              Get exclusive previews of unreleased content and stay updated with the latest developments.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/api/feed/rss"
                className="text-gray-400 hover:text-rivian-green transition-colors"
                title="RSS Feed"
              >
                <Rss className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-gray-400 hover:text-rivian-green transition-colors"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/staging" className="text-gray-400 hover:text-white transition-colors">
                  Staging Alerts
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support Docs
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* RSS Feeds */}
          <div>
            <h3 className="text-lg font-semibold mb-4">RSS Feeds</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/api/feed/rss" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All News
                </Link>
              </li>
              <li>
                <Link 
                  href="/api/feed/rss?type=staging" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Staging Content
                </Link>
              </li>
              <li>
                <Link 
                  href="/api/feed/rss?category=OFFICIAL_UPDATE" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Official Updates
                </Link>
              </li>
              <li>
                <Link 
                  href="/api/feed/rss?brand=RIVIAN" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Rivian Only
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Rivian News Tracker. Not affiliated with Rivian or Scout Motors.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
