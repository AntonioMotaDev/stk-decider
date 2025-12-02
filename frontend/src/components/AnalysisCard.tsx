'use client'

import React from 'react'
import { CombinedAnalysis } from '@/types/prediction'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface AnalysisCardProps {
  analysis: CombinedAnalysis
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  const { final_recommendation, final_confidence, reasons, technical_signals } = analysis.analysis

  const getRecommendationColor = () => {
    if (final_recommendation.includes('BUY')) {
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-500'
    } else if (final_recommendation.includes('SELL')) {
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-500'
    } else {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-500'
    }
  }

  const getRecommendationIcon = () => {
    if (final_recommendation.includes('BUY')) {
      return <CheckCircle className="w-8 h-8" />
    } else if (final_recommendation.includes('SELL')) {
      return <XCircle className="w-8 h-8" />
    } else {
      return <AlertCircle className="w-8 h-8" />
    }
  }

  const getRSIStatus = (rsi: number) => {
    if (rsi < 30) return { label: 'Sobreventa', color: 'text-green-600 dark:text-green-400' }
    if (rsi > 70) return { label: 'Sobrecompra', color: 'text-red-600 dark:text-red-400' }
    return { label: 'Neutral', color: 'text-blue-slate' }
  }

  const rsiStatus = getRSIStatus(technical_signals.rsi)

  return (
    <div className="bg-white dark:bg-gunmetal rounded-lg p-6 shadow-md">
      {/* Main Recommendation */}
      <div className={`border-2 rounded-lg p-6 mb-6 ${getRecommendationColor()}`}>
        <div className="flex items-center gap-4 mb-4">
          {getRecommendationIcon()}
          <div>
            <h3 className="text-2xl font-bold">{final_recommendation}</h3>
            <p className="text-sm opacity-80">Recomendación para {analysis.symbol}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Nivel de Confianza</span>
            <span className="font-bold">{final_confidence.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white dark:bg-shadow-grey rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${final_confidence}%`,
                backgroundColor: final_confidence >= 70 
                  ? 'rgb(34, 197, 94)' 
                  : final_confidence >= 50 
                  ? 'rgb(234, 179, 8)' 
                  : 'rgb(239, 68, 68)'
              }}
            />
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-2">
          <p className="text-sm font-semibold mb-2">Razones:</p>
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-xs mt-1">•</span>
              <p className="text-sm">{reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* RSI */}
        <div className="bg-gray-50 dark:bg-shadow-grey rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-ink-black dark:text-white">RSI</h4>
            <span className={`text-sm font-bold ${rsiStatus.color}`}>
              {rsiStatus.label}
            </span>
          </div>
          <div className="text-3xl font-bold text-ink-black dark:text-white mb-2">
            {technical_signals.rsi.toFixed(1)}
          </div>
          <div className="relative w-full bg-gray-200 dark:bg-gunmetal rounded-full h-2">
            {/* Zones */}
            <div className="absolute left-0 w-[30%] h-2 bg-green-500 opacity-20 rounded-l-full"></div>
            <div className="absolute right-0 w-[30%] h-2 bg-red-500 opacity-20 rounded-r-full"></div>
            {/* Indicator */}
            <div
              className="absolute h-2 w-1 bg-ink-black dark:bg-white rounded-full"
              style={{ left: `${technical_signals.rsi}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-shadow-grey dark:text-blue-slate mt-1">
            <span>0</span>
            <span>30</span>
            <span>70</span>
            <span>100</span>
          </div>
        </div>

        {/* MACD */}
        <div className="bg-gray-50 dark:bg-shadow-grey rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-ink-black dark:text-white">MACD</h4>
            <span className={`text-sm font-bold ${
              technical_signals.macd.histogram > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {technical_signals.macd.histogram > 0 ? 'Alcista' : 'Bajista'}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-shadow-grey dark:text-blue-slate">MACD:</span>
              <span className="font-bold text-ink-black dark:text-white">
                {technical_signals.macd.macd.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-shadow-grey dark:text-blue-slate">Signal:</span>
              <span className="font-bold text-ink-black dark:text-white">
                {technical_signals.macd.signal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-shadow-grey dark:text-blue-slate">Histogram:</span>
              <span className={`font-bold ${
                technical_signals.macd.histogram > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {technical_signals.macd.histogram.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signals */}
      {technical_signals.signals.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-ink-black dark:text-white mb-3">
            Señales Técnicas
          </h4>
          <div className="space-y-2">
            {technical_signals.signals.map((signal, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  signal.action === 'BUY'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : signal.action === 'SELL'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {signal.action === 'BUY' ? (
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : signal.action === 'SELL' ? (
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                  <div>
                    <p className="font-semibold text-ink-black dark:text-white">
                      {signal.type}
                    </p>
                    <p className="text-sm text-shadow-grey dark:text-blue-slate">
                      {signal.signal}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    signal.action === 'BUY'
                      ? 'bg-green-600 text-white'
                      : signal.action === 'SELL'
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {signal.action}
                  </span>
                  <p className="text-xs text-shadow-grey dark:text-blue-slate mt-1 capitalize">
                    {signal.strength}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-4 text-xs text-shadow-grey dark:text-blue-slate text-right">
        Análisis generado: {new Date(analysis.timestamp).toLocaleString('es-ES')}
      </div>
    </div>
  )
}
