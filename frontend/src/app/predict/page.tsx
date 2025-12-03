'use client'

import React, { useState } from 'react'
import { mlApi } from '@/lib/api'
import { CombinedAnalysis } from '@/types/prediction'
import { Search, Loader2, TrendingUp } from 'lucide-react'
import PredictionChart from '@/components/PredictionChart'
import AnalysisCard from '@/components/AnalysisCard'

type LoadingStep = {
  message: string
  progress: number
  tip?: string
}

const loadingSteps: LoadingStep[] = [
  { 
    message: '📊 Descargando datos históricos de Alpha Vantage...', 
    progress: 25,
    tip: 'Obteniendo últimos 60 días de precios de cierre'
  },
  { 
    message: '🤖 Entrenando modelo Prophet con 60 días de historia...', 
    progress: 50,
    tip: 'Prophet analiza patrones diarios y semanales'
  },
  { 
    message: '📈 Calculando indicadores técnicos (RSI, MACD)...', 
    progress: 75,
    tip: 'RSI detecta sobrecompra/sobreventa, MACD mide momentum'
  },
  { 
    message: '✨ Generando recomendación final...', 
    progress: 90,
    tip: 'Combinando predicción con señales técnicas'
  },
  { 
    message: '✅ ¡Análisis completado!', 
    progress: 100,
    tip: 'Resultados listos para visualizar'
  },
]

export default function PredictPage() {
  const [symbol, setSymbol] = useState('')
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<CombinedAnalysis | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!symbol) {
      setError('Por favor ingresa un símbolo de acción')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)
    setCurrentStep(0)

    try {
      // Simulate progress steps for better UX
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < loadingSteps.length - 2) {
            return prev + 1
          }
          return prev
        })
      }, 2000) // Change step every 2 seconds

      const result = await mlApi.getCombinedAnalysis(symbol.toUpperCase(), days)
      
      // Clear interval and show final step
      clearInterval(progressInterval)
      setCurrentStep(loadingSteps.length - 1)
      
      // Small delay to show "completed" message
      setTimeout(() => {
        setAnalysis(result)
        setLoading(false)
      }, 500)
    } catch (err: any) {
      console.error('Error fetching analysis:', err)
      setLoading(false)
      if (err.response?.status === 404) {
        setError(`No se encontraron datos suficientes para ${symbol}`)
      } else if (err.response?.status === 429) {
        setError('Límite de API alcanzado. Intenta nuevamente más tarde.')
      } else {
        setError('Error al obtener el análisis. Verifica el símbolo e intenta nuevamente.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-black pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-10 h-10 text-blue-slate" />
            <h1 className="text-4xl font-bold text-ink-black dark:text-white">
              Predicciones ML
            </h1>
          </div>
          <p className="text-shadow-grey dark:text-blue-slate max-w-2xl mx-auto">
            Análisis inteligente basado en Machine Learning para predecir precios futuros 
            y generar recomendaciones de inversión
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleAnalyze} className="mb-8">
          <div className="bg-white dark:bg-gunmetal rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-shadow-grey dark:text-blue-slate mb-2">
                  Símbolo de Acción
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shadow-grey dark:text-blue-slate w-5 h-5" />
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="Ej: AAPL, MSFT, GOOGL..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-shadow-grey rounded-lg 
                             bg-white dark:bg-shadow-grey text-ink-black dark:text-white
                             focus:ring-2 focus:ring-blue-slate focus:border-transparent
                             placeholder-shadow-grey dark:placeholder-blue-slate"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-shadow-grey dark:text-blue-slate mb-2">
                  Días a Predecir
                </label>      
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-shadow-grey rounded-lg 
                           bg-white dark:bg-shadow-grey text-ink-black dark:text-white
                           focus:ring-2 focus:ring-blue-slate focus:border-transparent"
                >
                  <option value={3}>3 días</option>
                  <option value={7}>7 días</option>
                  <option value={14}>14 días</option>
                  <option value={30}>30 días</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !symbol}
              className="mt-4 w-full bg-blue-slate hover:bg-blue-slate/80 text-white font-bold py-3 px-6 
                       rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Analizar Acción
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Progress */}
        {loading && (
          <div className="mb-8 bg-white dark:bg-gunmetal rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-ink-black dark:text-white text-center">
                Analizando {symbol.toUpperCase()}
              </h3>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-shadow-grey rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-slate to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${loadingSteps[currentStep].progress}%` }}
                  >
                    <div className="w-full h-full animate-pulse bg-white/20"></div>
                  </div>
                </div>
                <div className="absolute -top-1 right-0 text-xs font-bold text-blue-slate">
                  {loadingSteps[currentStep].progress}%
                </div>
              </div>

              {/* Current Step Message */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-slate" />
                  <p className="text-ink-black dark:text-white font-medium">
                    {loadingSteps[currentStep].message}
                  </p>
                </div>
                {loadingSteps[currentStep].tip && (
                  <p className="text-center text-sm text-shadow-grey dark:text-blue-slate italic">
                    💡 {loadingSteps[currentStep].tip}
                  </p>
                )}
              </div>

              {/* Step Indicators */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-shadow-grey">
                {loadingSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-blue-slate scale-110'
                          : 'bg-gray-300 dark:bg-shadow-grey'
                      }`}
                    />
                    <span className="text-xs text-shadow-grey dark:text-blue-slate hidden md:block">
                      Paso {index + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Estimated Time */}
              <p className="text-center text-sm text-shadow-grey dark:text-blue-slate mt-4">
                ⏱️ Tiempo estimado: 5-10 segundos
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                        rounded-lg p-4 text-red-800 dark:text-red-200">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {analysis && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Analysis Card */}
            <AnalysisCard analysis={analysis} />
            
            {/* Prediction Chart */}
            <PredictionChart prediction={analysis.analysis.prediction} />

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
                          rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                ℹ️ Información Importante
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Las predicciones se basan en modelos de Machine Learning (Prophet)</li>
                <li>• Los indicadores técnicos incluyen RSI y MACD</li>
                <li>• El intervalo de confianza muestra el rango probable de precios</li>
                <li>• Esta herramienta es para análisis educativo, no constituye asesoría financiera</li>
                <li>• Los resultados se almacenan en caché por 24 horas para optimizar el rendimiento</li>
              </ul>
            </div>

            {/* API Usage Info */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
                          rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                📊 Consumo de API Optimizado
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                <li>• <strong>Solo 1 llamada API</strong> por análisis (optimizado)</li>
                <li>• Resultados en caché: <strong>0 llamadas API</strong> por 24h</li>
                <li>• Límite gratuito: <strong>25 símbolos diferentes</strong> por día</li>
                <li>• Mismo símbolo múltiples veces: <strong>no consume llamadas extra</strong></li>
                <li>• Consultas subsecuentes del mismo símbolo son <strong>instantáneas</strong></li>
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && !error && (
          <div className="text-center py-16">
            <TrendingUp className="w-20 h-20 text-shadow-grey dark:text-blue-slate mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-shadow-grey dark:text-blue-slate mb-2">
              Ingresa un símbolo para comenzar
            </h3>
            <p className="text-sm text-shadow-grey dark:text-blue-slate">
              Obtén predicciones de precios e indicadores técnicos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
