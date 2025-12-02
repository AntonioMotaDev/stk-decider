export interface PricePredictionPoint {
  date: string;
  predicted_price: number;
  lower_bound: number;
  upper_bound: number;
  confidence: number;
}

export interface PricePrediction {
  symbol: string;
  current_price: number;
  predicted_price: number;
  trend: 'up' | 'down';
  change_percent: number;
  confidence_score: number;
  predictions: PricePredictionPoint[];
  days_predicted: number;
  timestamp: string;
}

export interface TechnicalSignal {
  type: string;
  signal: string;
  strength: 'weak' | 'medium' | 'strong';
  action: 'BUY' | 'SELL' | 'HOLD';
}

export interface MACDIndicator {
  macd: number;
  signal: number;
  histogram: number;
}

export interface TechnicalAnalysis {
  symbol: string;
  rsi: number;
  macd: MACDIndicator;
  signals: TechnicalSignal[];
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: string;
}

export interface CombinedAnalysisData {
  prediction: PricePrediction;
  technical_signals: TechnicalAnalysis;
  final_recommendation: string;
  final_confidence: number;
  reasons: string[];
}

export interface CombinedAnalysis {
  symbol: string;
  analysis: CombinedAnalysisData;
  timestamp: string;
}
