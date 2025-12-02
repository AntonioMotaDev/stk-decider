'use client'

import { ScreenedStock } from '@/types/screener'
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'

interface StockTableProps {
  stocks: ScreenedStock[]
  loading?: boolean
  onSelectStock?: (stock: ScreenedStock) => void
}

export default function StockTable({ stocks, loading, onSelectStock }: StockTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return value.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-slate"></div>
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-blue-slate text-lg">No stocks found matching criteria</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-blue-slate/20">
            <th className="text-left py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              #
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Símbolo
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Nombre
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Precio
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Cambio
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Cambio (%)
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Potencial
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              P/E
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Cap. Mercado
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gunmetal dark:text-white">
              Razones
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => {
            const isPositive = stock.changePercent >= 0
            const hasHighUpside = stock.upside && stock.upside > 20

            return (
              <tr
                key={stock.symbol}
                onClick={() => onSelectStock?.(stock)}
                className="border-b border-blue-slate/10 hover:bg-blue-slate/5 cursor-pointer transition-colors"
              >
                <td className="py-4 px-4 text-sm text-blue-slate">
                  {index + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gunmetal dark:text-white">
                      {stock.symbol}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-gunmetal dark:text-white truncate max-w-[200px]">
                      {stock.name}
                    </p>
                    <p className="text-xs text-blue-slate">{stock.sector}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-semibold text-gunmetal dark:text-white">
                    {formatCurrency(stock.currentPrice)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(stock.change)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  {stock.upside ? (
                    <div className={`flex items-center justify-end gap-1 ${hasHighUpside ? 'text-green-600 font-bold' : 'text-blue-slate'}`}>
                      <Target className="w-4 h-4" />
                      <span className="text-sm">
                        +{stock.upside.toFixed(1)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-blue-slate/50">N/A</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gunmetal dark:text-white">
                    {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gunmetal dark:text-white">
                    {formatNumber(stock.marketCap)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {stock.reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-slate/10 text-blue-slate"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
