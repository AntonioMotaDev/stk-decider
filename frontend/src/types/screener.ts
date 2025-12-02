export interface ScreenedStock {
  symbol: string
  name: string
  currentPrice: number
  targetPrice?: number
  upside?: number
  peRatio?: number
  pegRatio?: number
  pbRatio?: number
  marketCap: number
  volume: number
  averageVolume: number
  change: number
  changePercent: number
  fiftyTwoWeekLow: number
  fiftyTwoWeekHigh: number
  dividendYield?: number
  reasons: string[]
  sector: string
  industry: string
}

export interface TopMover {
  symbol: string
  name: string
  currentPrice: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

export interface ScreenerResponse {
  category: string
  stocks: ScreenedStock[]
  count: number
}

export interface TopMoversResponse {
  category: string
  stocks: TopMover[]
  count: number
}
