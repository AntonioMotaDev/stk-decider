from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.schemas.prediction import (
    PricePrediction, 
    TechnicalAnalysis, 
    CombinedAnalysis
)
from app.services.ml_prediction import MLPredictionService

router = APIRouter()
ml_service = MLPredictionService()

@router.get("/predict/{symbol}", response_model=PricePrediction)
async def predict_stock_price(
    symbol: str,
    days: Optional[int] = Query(7, ge=1, le=30, description="Number of days to predict")
):
    """
    Predict stock prices using Prophet ML model
    
    - **symbol**: Stock symbol (e.g., AAPL, MSFT)
    - **days**: Number of days to predict (1-30, default: 7)
    
    Returns price predictions with confidence intervals
    """
    try:
        result = ml_service.predict_stock_price(symbol.upper(), days)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting stock: {str(e)}")

@router.get("/signals/{symbol}", response_model=TechnicalAnalysis)
async def get_technical_signals(symbol: str):
    """
    Get technical indicators and trading signals
    
    - **symbol**: Stock symbol (e.g., AAPL, MSFT)
    
    Returns RSI, MACD, signals, and recommendation
    """
    try:
        result = ml_service.get_technical_signals(symbol.upper())
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating signals: {str(e)}")

@router.get("/analyze/{symbol}", response_model=CombinedAnalysis)
async def get_combined_analysis(
    symbol: str,
    days: Optional[int] = Query(7, ge=1, le=30, description="Number of days to predict")
):
    """
    Get comprehensive analysis: predictions + technical signals
    
    - **symbol**: Stock symbol (e.g., AAPL, MSFT)
    - **days**: Number of days to predict (1-30, default: 7)
    
    Returns complete analysis with final recommendation
    """
    try:
        result = ml_service.get_combined_analysis(symbol.upper(), days)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in analysis: {str(e)}")
