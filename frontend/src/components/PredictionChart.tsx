'use client'

import React from 'react'
import { PricePrediction } from '@/types/prediction'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface PredictionChartProps {
  prediction: PricePrediction
}

export default function PredictionChart({ prediction }: PredictionChartProps) {
  const maxPrice = Math.max(...prediction.predictions.map(p => p.upper_bound))
  const minPrice = Math.min(...prediction.predictions.map(p => p.lower_bound))
  const priceRange = maxPrice - minPrice
  const padding = priceRange * 0.1

  const getYPosition = (price: number) => {
    const normalized = (maxPrice + padding - price) / (priceRange + 2 * padding)
    return normalized * 100
  }

  return (
    <div className="bg-white dark:bg-gunmetal rounded-lg p-6 shadow-md">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-ink-black dark:text-white">
            {prediction.symbol}
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            prediction.trend === 'up' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {prediction.trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-bold">
              {prediction.change_percent > 0 ? '+' : ''}
              {prediction.change_percent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-shadow-grey dark:text-blue-slate">Precio Actual</p>
            <p className="text-xl font-bold text-ink-black dark:text-white">
              ${prediction.current_price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-shadow-grey dark:text-blue-slate">
              Predicción {prediction.days_predicted}d
            </p>
            <p className="text-xl font-bold text-ink-black dark:text-white">
              ${prediction.predicted_price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-shadow-grey dark:text-blue-slate flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Confianza del Modelo
            </span>
            <span className="font-bold text-ink-black dark:text-white">
              {prediction.confidence_score.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-shadow-grey rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                prediction.confidence_score >= 70
                  ? 'bg-green-500'
                  : prediction.confidence_score >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${prediction.confidence_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 bg-gray-50 dark:bg-shadow-grey rounded-lg p-4">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Confidence band */}
          <path
            d={prediction.predictions.map((point, index) => {
              const x = (index / (prediction.predictions.length - 1)) * 100
              const yUpper = getYPosition(point.upper_bound)
              const yLower = getYPosition(point.lower_bound)
              if (index === 0) {
                return `M ${x} ${yLower} L ${x} ${yUpper}`
              }
              return `L ${x} ${yUpper}`
            }).join(' ') + 
            prediction.predictions.slice().reverse().map((point, index) => {
              const x = ((prediction.predictions.length - 1 - index) / (prediction.predictions.length - 1)) * 100
              const yLower = getYPosition(point.lower_bound)
              return `L ${x} ${yLower}`
            }).join(' ') + ' Z'}
            fill={prediction.trend === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
            stroke="none"
          />

          {/* Predicted price line */}
          <polyline
            points={prediction.predictions.map((point, index) => {
              const x = (index / (prediction.predictions.length - 1)) * 100
              const y = getYPosition(point.predicted_price)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke={prediction.trend === 'up' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Current price line */}
          <line
            x1="0"
            y1={getYPosition(prediction.current_price)}
            x2="100"
            y2={getYPosition(prediction.current_price)}
            stroke="rgb(99, 102, 241)"
            strokeWidth="2"
            strokeDasharray="5,5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Price labels */}
        <div className="absolute top-4 left-4 text-xs">
          <div className="bg-white dark:bg-gunmetal px-2 py-1 rounded shadow">
            ${maxPrice.toFixed(2)}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-xs">
          <div className="bg-white dark:bg-gunmetal px-2 py-1 rounded shadow">
            ${minPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-indigo-500"></div>
          <span className="text-shadow-grey dark:text-blue-slate">Precio Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-0.5 ${prediction.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-shadow-grey dark:text-blue-slate">Predicción</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-2 ${prediction.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} opacity-10`}></div>
          <span className="text-shadow-grey dark:text-blue-slate">Intervalo de Confianza</span>
        </div>
      </div>

      {/* Prediction Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-shadow-grey">
              <th className="text-left py-2 text-shadow-grey dark:text-blue-slate">Fecha</th>
              <th className="text-right py-2 text-shadow-grey dark:text-blue-slate">Predicción</th>
              <th className="text-right py-2 text-shadow-grey dark:text-blue-slate">Rango</th>
            </tr>
          </thead>
          <tbody>
            {prediction.predictions.map((point, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-shadow-grey">
                <td className="py-2 text-ink-black dark:text-white">
                  {new Date(point.date).toLocaleDateString('es-ES', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="text-right font-bold text-ink-black dark:text-white">
                  ${point.predicted_price.toFixed(2)}
                </td>
                <td className="text-right text-xs text-shadow-grey dark:text-blue-slate">
                  ${point.lower_bound.toFixed(2)} - ${point.upper_bound.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
