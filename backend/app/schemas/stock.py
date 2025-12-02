from pydantic import BaseModel
from typing import List, Optional

class StockSearchResult(BaseModel):
    symbol: str
    name: str
    type: str
    exchange: str

class StockSearch(BaseModel):
    query: str
    results: List[StockSearchResult]

class StockInfo(BaseModel):
    symbol: str
    name: str
    currency: str
    exchange: str
    sector: str
    industry: str
    marketCap: float
    website: str
    description: str
    employees: int
    country: str
    currentPrice: float
    previousClose: float
    open: float
    dayLow: float
    dayHigh: float
    fiftyTwoWeekLow: float
    fiftyTwoWeekHigh: float
    volume: int
    averageVolume: int
    dividendYield: Optional[float] = 0
    beta: Optional[float] = 0
    trailingPE: Optional[float] = 0
    forwardPE: Optional[float] = 0

class HistoricalData(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class StockHistory(BaseModel):
    symbol: str
    period: str
    data: List[HistoricalData]

class StockQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    changePercent: float
    previousClose: float
    open: float
    dayLow: float
    dayHigh: float
    volume: int
    marketCap: float
    timestamp: str
