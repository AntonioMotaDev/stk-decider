'use client'

import { StockInfo } from '@/types/stock'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockCardProps {
  stock: StockInfo
}

export default function StockCard({ stock }: StockCardProps) {
  const priceChange = stock.currentPrice - stock.previousClose
  const percentChange = (priceChange / stock.previousClose) * 100
  const isPositive = priceChange >= 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stock.currency || 'USD',
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return formatCurrency(value)
  }

  return (
    <div className="bg-white dark:bg-shadow-grey rounded-2xl shadow-lg p-6 border border-blue-slate/20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gunmetal dark:text-white">
            {stock.symbol}
          </h2>
          <p className="text-blue-slate text-lg">{stock.name}</p>
          <p className="text-blue-slate/70 text-sm">
            {stock.exchange} • {stock.country}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-gunmetal dark:text-white">
            {formatCurrency(stock.currentPrice)}
          </p>
          <div className={`flex items-center justify-end gap-1 mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="font-semibold">
              {formatCurrency(Math.abs(priceChange))} ({percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-blue-slate text-sm">Previous Close</p>
          <p className="text-gunmetal dark:text-white font-semibold">
            {formatCurrency(stock.previousClose)}
          </p>
        </div>
        <div>
          <p className="text-blue-slate text-sm">Day Range</p>
          <p className="text-gunmetal dark:text-white font-semibold">
            {formatCurrency(stock.dayLow)} - {formatCurrency(stock.dayHigh)}
          </p>
        </div>
        <div>
          <p className="text-blue-slate text-sm">52 Week Range</p>
          <p className="text-gunmetal dark:text-white font-semibold text-sm">
            {formatCurrency(stock.fiftyTwoWeekLow)} - {formatCurrency(stock.fiftyTwoWeekHigh)}
          </p>
        </div>
        <div>
          <p className="text-blue-slate text-sm">Market Cap</p>
          <p className="text-gunmetal dark:text-white font-semibold">
            {formatNumber(stock.marketCap)}
          </p>
        </div>
      </div>

      <div className="border-t border-blue-slate/20 pt-6">
        <h3 className="text-xl font-bold text-gunmetal dark:text-white mb-3">
          Company Info
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-blue-slate text-sm">Sector</p>
            <p className="text-gunmetal dark:text-white font-semibold">{stock.sector}</p>
          </div>
          <div>
            <p className="text-blue-slate text-sm">Industry</p>
            <p className="text-gunmetal dark:text-white font-semibold">{stock.industry}</p>
          </div>
        </div>
        {stock.description && (
          <div>
            <p className="text-blue-slate text-sm mb-2">Description</p>
            <p className="text-gunmetal dark:text-white text-sm leading-relaxed">
              {stock.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
