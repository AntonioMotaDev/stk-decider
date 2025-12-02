from fastapi import APIRouter, HTTPException
from app.services.alpha_vantage import AlphaVantageService
from app.schemas.stock import StockInfo, StockHistory, StockSearch

router = APIRouter()
av_service = AlphaVantageService()

@router.get("/search/{query}", response_model=StockSearch)
async def search_stocks(query: str):
    """Search for stocks by symbol or name"""
    try:
        results = av_service.search_stocks(query)
        results = results[:5]  # Limit to top 5 results
        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/info/{symbol}", response_model=StockInfo)
async def get_stock_info(symbol: str):
    """Get detailed information about a stock"""
    try:
        info = av_service.get_stock_info(symbol)
        return info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

@router.get("/history/{symbol}", response_model=StockHistory)
async def get_stock_history(symbol: str, period: str = "1mo"):
    """Get historical data for a stock
    
    Periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    """
    try:
        history = av_service.get_stock_history(symbol, period)
        return {"symbol": symbol, "period": period, "data": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quote/{symbol}")
async def get_stock_quote(symbol: str):
    """Get real-time quote for a stock"""
    try:
        quote = av_service.get_stock_quote(symbol)
        return quote
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
