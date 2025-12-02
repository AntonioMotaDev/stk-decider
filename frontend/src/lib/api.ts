import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const stockApi = {
  searchStocks: async (query: string) => {
    const response = await api.get(`/api/stocks/search/${query}`)
    return response.data
  },

  getStockInfo: async (symbol: string) => {
    const response = await api.get(`/api/stocks/info/${symbol}`)
    return response.data
  },

  getStockHistory: async (symbol: string, period: string = '1mo') => {
    const response = await api.get(`/api/stocks/history/${symbol}?period=${period}`)
    return response.data
  },

  getStockQuote: async (symbol: string) => {
    const response = await api.get(`/api/stocks/quote/${symbol}`)
    return response.data
  },
}

export const screenerApi = {
  getUndervaluedStocks: async () => {
    const response = await api.get('/api/screener/undervalued')
    return response.data
  },

  getTopGainers: async () => {
    const response = await api.get('/api/screener/gainers')
    return response.data
  },

  getTopLosers: async () => {
    const response = await api.get('/api/screener/losers')
    return response.data
  },
}

export const mlApi = {
  predictStockPrice: async (symbol: string, days: number = 7) => {
    const response = await api.get(`/api/ml/predict/${symbol}?days=${days}`)
    return response.data
  },

  getTechnicalSignals: async (symbol: string) => {
    const response = await api.get(`/api/ml/signals/${symbol}`)
    return response.data
  },

  getCombinedAnalysis: async (symbol: string, days: number = 7) => {
    const response = await api.get(`/api/ml/analyze/${symbol}?days=${days}`)
    return response.data
  },
}
