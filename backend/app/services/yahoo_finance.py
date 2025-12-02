import yfinance as yf
from typing import List, Dict, Any
from datetime import datetime

class YahooFinanceService:
    """Service for interacting with Yahoo Finance API"""
    
    def search_stocks(self, query: str) -> List[Dict[str, Any]]:
        """Search for stocks by symbol or name"""
        try:
            ticker = yf.Ticker(query.upper())
            info = ticker.info
            
            if info and 'symbol' in info:
                return [{
                    "symbol": info.get('symbol', query.upper()),
                    "name": info.get('longName', info.get('shortName', 'N/A')),
                    "type": info.get('quoteType', 'EQUITY'),
                    "exchange": info.get('exchange', 'N/A')
                }]
            return []
        except Exception as e:
            print(f"Error searching stocks: {e}")
            return []
    
    def get_stock_info(self, symbol: str) -> Dict[str, Any]:
        """Get detailed information about a stock"""
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info
        
        return {
            "symbol": info.get('symbol', symbol.upper()),
            "name": info.get('longName', info.get('shortName', 'N/A')),
            "currency": info.get('currency', 'USD'),
            "exchange": info.get('exchange', 'N/A'),
            "sector": info.get('sector', 'N/A'),
            "industry": info.get('industry', 'N/A'),
            "marketCap": info.get('marketCap', 0),
            "website": info.get('website', ''),
            "description": info.get('longBusinessSummary', ''),
            "employees": info.get('fullTimeEmployees', 0),
            "country": info.get('country', 'N/A'),
            "currentPrice": info.get('currentPrice', info.get('regularMarketPrice', 0)),
            "previousClose": info.get('previousClose', 0),
            "open": info.get('open', 0),
            "dayLow": info.get('dayLow', 0),
            "dayHigh": info.get('dayHigh', 0),
            "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow', 0),
            "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh', 0),
            "volume": info.get('volume', 0),
            "averageVolume": info.get('averageVolume', 0),
            "dividendYield": info.get('dividendYield', 0),
            "beta": info.get('beta', 0),
            "trailingPE": info.get('trailingPE', 0),
            "forwardPE": info.get('forwardPE', 0)
        }
    
    def get_stock_history(self, symbol: str, period: str = "1mo") -> List[Dict[str, Any]]:
        """Get historical data for a stock"""
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period=period)
        
        data = []
        for index, row in hist.iterrows():
            data.append({
                "date": index.strftime('%Y-%m-%d'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume'])
            })
        
        return data
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get real-time quote for a stock"""
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info
        
        return {
            "symbol": info.get('symbol', symbol.upper()),
            "name": info.get('longName', info.get('shortName', 'N/A')),
            "price": info.get('currentPrice', info.get('regularMarketPrice', 0)),
            "change": info.get('regularMarketChange', 0),
            "changePercent": info.get('regularMarketChangePercent', 0),
            "previousClose": info.get('previousClose', 0),
            "open": info.get('open', 0),
            "dayLow": info.get('dayLow', 0),
            "dayHigh": info.get('dayHigh', 0),
            "volume": info.get('volume', 0),
            "marketCap": info.get('marketCap', 0),
            "timestamp": datetime.now().isoformat()
        }
