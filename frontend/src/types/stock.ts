export interface StockInfo {
  symbol: string
  name: string
  currency: string
  exchange: string
  sector: string
  industry: string
  marketCap: number
  website: string
  description: string
  employees: number
  country: string
  currentPrice: number
  previousClose: number
  open: number
  dayLow: number
  dayHigh: number
  fiftyTwoWeekLow: number
  fiftyTwoWeekHigh: number
  volume: number
  averageVolume: number
  dividendYield?: number
  beta?: number
  trailingPE?: number
  forwardPE?: number
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockHistory {
  symbol: string
  period: string
  data: HistoricalData[]
}

export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  open: number
  dayLow: number
  dayHigh: number
  volume: number
  marketCap: number
  timestamp: string
}
