from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PricePredictionPoint(BaseModel):
    """Single price prediction point"""
    date: str = Field(..., description="Prediction date (YYYY-MM-DD)")
    predicted_price: float = Field(..., description="Predicted stock price")
    lower_bound: float = Field(..., description="Lower confidence bound")
    upper_bound: float = Field(..., description="Upper confidence bound")
    confidence: float = Field(..., description="Prediction confidence")

class PricePrediction(BaseModel):
    """Stock price prediction response"""
    symbol: str = Field(..., description="Stock symbol")
    current_price: float = Field(..., description="Current stock price")
    predicted_price: float = Field(..., description="Final predicted price")
    trend: str = Field(..., description="Trend direction (up/down)")
    change_percent: float = Field(..., description="Predicted change percentage")
    confidence_score: float = Field(..., description="Overall prediction confidence (0-100)")
    predictions: List[PricePredictionPoint] = Field(..., description="Daily predictions")
    days_predicted: int = Field(..., description="Number of days predicted")
    timestamp: str = Field(..., description="Analysis timestamp")

class TechnicalSignal(BaseModel):
    """Technical indicator signal"""
    type: str = Field(..., description="Signal type (RSI, MACD, etc.)")
    signal: str = Field(..., description="Signal description")
    strength: str = Field(..., description="Signal strength (weak/medium/strong)")
    action: str = Field(..., description="Recommended action (BUY/SELL/HOLD)")

class MACDIndicator(BaseModel):
    """MACD technical indicator"""
    macd: float = Field(..., description="MACD line value")
    signal: float = Field(..., description="Signal line value")
    histogram: float = Field(..., description="MACD histogram value")

class TechnicalAnalysis(BaseModel):
    """Technical analysis response"""
    symbol: str = Field(..., description="Stock symbol")
    rsi: float = Field(..., description="Relative Strength Index (0-100)")
    macd: MACDIndicator = Field(..., description="MACD indicator values")
    signals: List[TechnicalSignal] = Field(..., description="Generated signals")
    recommendation: str = Field(..., description="Overall recommendation (BUY/SELL/HOLD)")
    confidence: float = Field(..., description="Recommendation confidence (0-100)")
    timestamp: str = Field(..., description="Analysis timestamp")

class CombinedAnalysisData(BaseModel):
    """Combined prediction and technical analysis"""
    prediction: PricePrediction = Field(..., description="Price prediction data")
    technical_signals: TechnicalAnalysis = Field(..., description="Technical analysis data")
    final_recommendation: str = Field(..., description="Final recommendation")
    final_confidence: float = Field(..., description="Final confidence score")
    reasons: List[str] = Field(..., description="Human-readable reasons")

class CombinedAnalysis(BaseModel):
    """Complete stock analysis response"""
    symbol: str = Field(..., description="Stock symbol")
    analysis: CombinedAnalysisData = Field(..., description="Analysis data")
    timestamp: str = Field(..., description="Analysis timestamp")

class PredictionRequest(BaseModel):
    """Request for price prediction"""
    symbol: str = Field(..., description="Stock symbol", example="AAPL")
    days: Optional[int] = Field(7, description="Number of days to predict", ge=1, le=30)
