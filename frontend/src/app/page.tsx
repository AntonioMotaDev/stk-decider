'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import StockCard from '@/components/StockCard'
import StockChart from '@/components/StockChart'
import { StockInfo, StockHistory } from '@/types/stock'

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null)
  const [stockHistory, setStockHistory] = useState<StockHistory | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gunmetal dark:text-white">
          STK Decider
        </h1>
        <p className="text-xl text-blue-slate">
          Real-time Stock Data Analysis
        </p>
      </div>

      <SearchBar 
        onStockSelect={setSelectedStock}
        onHistoryLoad={setStockHistory}
      />

      {selectedStock && (
        <div className="mt-8 space-y-6">
          <StockCard stock={selectedStock} />
          
          {stockHistory && (
            <StockChart history={stockHistory} />
          )}
        </div>
      )}

      {!selectedStock && (
        <div className="mt-16 text-center">
          <p className="text-blue-slate text-lg">
            Search for a stock to get started
          </p>
        </div>
      )}
    </div>
  )
}
