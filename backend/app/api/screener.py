from fastapi import APIRouter
from app.services.stock_screener import StockScreenerService
from app.schemas.screener import ScreenerResponse, TopMoversResponse

router = APIRouter()
screener_service = StockScreenerService()

@router.get("/undervalued", response_model=ScreenerResponse)
async def get_undervalued_stocks():
    """Get stocks that appear undervalued based on various metrics"""
    stocks = screener_service.get_undervalued_stocks()
    return {
        "category": "undervalued",
        "stocks": stocks,
        "count": len(stocks)
    }

@router.get("/gainers", response_model=TopMoversResponse)
async def get_top_gainers():
    """Get top gaining stocks today"""
    stocks = screener_service.get_top_gainers()
    return {
        "category": "gainers",
        "stocks": stocks,
        "count": len(stocks)
    }

@router.get("/losers", response_model=TopMoversResponse)
async def get_top_losers():
    """Get top losing stocks today"""
    stocks = screener_service.get_top_losers()
    return {
        "category": "losers",
        "stocks": stocks,
        "count": len(stocks)
    }
