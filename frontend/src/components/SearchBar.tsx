'use client'

import { useState } from 'react'
import { stockApi } from '@/lib/api'
import { StockInfo, StockHistory } from '@/types/stock'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onStockSelect: (stock: StockInfo) => void
  onHistoryLoad: (history: StockHistory) => void
}

export default function SearchBar({ onStockSelect, onHistoryLoad }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')

    try {
      const info = await stockApi.getStockInfo(query.toUpperCase())
      onStockSelect(info)

      const history = await stockApi.getStockHistory(query.toUpperCase(), '1mo')
      onHistoryLoad(history)
    } catch (err) {
      setError('Stock not found. Please try another symbol.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-slate w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-slate/30 
                     bg-white dark:bg-shadow-grey
                     text-gunmetal dark:text-white
                     placeholder-blue-slate/60
                     focus:outline-none focus:border-blue-slate
                     transition-colors text-lg"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2
                   px-6 py-2 rounded-lg
                   bg-blue-slate hover:bg-blue-slate/80
                   text-white font-semibold
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}
