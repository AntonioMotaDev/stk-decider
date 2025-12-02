from pydantic import BaseModel
from typing import List, Optional

class ScreenedStock(BaseModel):
    symbol: str
    name: str
    currentPrice: float
    targetPrice: Optional[float] = None
    upside: Optional[float] = None
    peRatio: Optional[float] = None
    pegRatio: Optional[float] = None
    pbRatio: Optional[float] = None
    marketCap: float
    volume: int
    averageVolume: int
    change: float
    changePercent: float
    fiftyTwoWeekLow: float
    fiftyTwoWeekHigh: float
    dividendYield: Optional[float] = None
    reasons: List[str] = []
    sector: str
    industry: str

class TopMover(BaseModel):
    symbol: str
    name: str
    currentPrice: float
    change: float
    changePercent: float
    volume: int
    marketCap: float

class ScreenerResponse(BaseModel):
    category: str
    stocks: List[ScreenedStock]
    count: int

class TopMoversResponse(BaseModel):
    category: str
    stocks: List[TopMover]
    count: int
