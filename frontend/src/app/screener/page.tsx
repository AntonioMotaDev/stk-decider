'use client'

import { useState, useEffect } from 'react'
import { screenerApi } from '@/lib/api'
import { ScreenedStock } from '@/types/screener'
import StockTable from '@/components/StockTable'
import { TrendingUp, RefreshCw } from 'lucide-react'

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<ScreenedStock[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'undervalued' | 'gainers' | 'losers'>('undervalued')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const loadStocks = async () => {
    setLoading(true)
    try {
      let response
      if (activeTab === 'undervalued') {
        response = await screenerApi.getUndervaluedStocks()
      } else if (activeTab === 'gainers') {
        response = await screenerApi.getTopGainers()
      } else {
        response = await screenerApi.getTopLosers()
      }
      setStocks(response.stocks)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStocks()
  }, [activeTab])

  const handleRefresh = () => {
    loadStocks()
  }

  const tabs = [
    { id: 'undervalued' as const, label: 'Infravaloradas', icon: TrendingUp },
    { id: 'gainers' as const, label: 'Más ganadores', icon: TrendingUp },
    { id: 'losers' as const, label: 'Más perdedores', icon: TrendingUp },
  ]

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gunmetal dark:text-white mb-2">
                Explorador de Acciones
              </h1>
              <p className="text-blue-slate">
                Descubre oportunidades de inversión con crecimiento infravalorado
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-slate hover:bg-blue-slate/80 text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
          
          <p className="text-sm text-blue-slate">
            Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-blue-slate/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-slate text-blue-slate'
                  : 'border-transparent text-gunmetal/50 dark:text-white/50 hover:text-gunmetal dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stock Count */}
        {!loading && stocks.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-blue-slate">
              {stocks.length} acciones encontradas
            </p>
          </div>
        )}

        {/* Stock Table */}
        <div className="bg-white dark:bg-shadow-grey rounded-2xl shadow-lg border border-blue-slate/20 overflow-hidden">
          <StockTable 
            stocks={stocks} 
            loading={loading}
            onSelectStock={(stock) => {
              // Navigate to stock detail or open modal
              window.location.href = `/?symbol=${stock.symbol}`
            }}
          />
        </div>

        {/* Info Section */}
        {activeTab === 'undervalued' && !loading && stocks.length > 0 && (
          <div className="mt-8 p-6 bg-blue-slate/10 rounded-xl border border-blue-slate/20">
            <h3 className="text-lg font-bold text-gunmetal dark:text-white mb-3">
              ¿Cómo identificamos acciones infravaloradas?
            </h3>
            <ul className="space-y-2 text-sm text-blue-slate">
              <li className="flex items-start gap-2">
                <span className="text-blue-slate font-bold">•</span>
                <span><strong>P/E bajo:</strong> Ratio precio/ganancia menor a 20, indicando precio atractivo respecto a ganancias</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-slate font-bold">•</span>
                <span><strong>PEG bajo:</strong> Ratio PEG menor a 1, sugiriendo buen precio considerando el crecimiento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-slate font-bold">•</span>
                <span><strong>Alto potencial:</strong> Precio objetivo supera el precio actual en más del 15%</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
