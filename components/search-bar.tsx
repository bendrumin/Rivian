'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter } from 'lucide-react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${type}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news, support articles, or staging content..."
          className="input pl-10 pr-20"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-transparent border-0 text-sm text-gray-500 focus:outline-none focus:ring-0 pr-3"
          >
            <option value="all">All</option>
            <option value="articles">News</option>
            <option value="support">Support</option>
            <option value="staging">Staging</option>
          </select>
          <button
            type="submit"
            className="btn btn-primary ml-2"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  )
}
