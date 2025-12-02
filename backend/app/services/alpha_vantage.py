from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.fundamentaldata import FundamentalData
from typing import List, Dict, Any
from datetime import datetime
from app.core.config import settings
import requests

class AlphaVantageService:
    """Service for interacting with Alpha Vantage API"""
    
    def __init__(self):
        self.api_key = settings.ALPHA_VANTAGE_API_KEY
        self.ts = TimeSeries(key=self.api_key, output_format='json')
        self.fd = FundamentalData(key=self.api_key, output_format='json')
        self.base_url = "https://www.alphavantage.co/query"
    
    def search_stocks(self, query: str) -> List[Dict[str, Any]]:
        """Search for stocks by symbol or name"""
        try:
            params = {
                'function': 'SYMBOL_SEARCH',
                'keywords': query,
                'apikey': self.api_key
            }
            response = requests.get(self.base_url, params=params, timeout=10)
            data = response.json()
            
            if 'bestMatches' not in data:
                return []
            
            results = []
            for match in data['bestMatches'][:5]:  # Top 5 results
                results.append({
                    'symbol': match.get('1. symbol', ''),
                    'name': match.get('2. name', ''),
                    'type': match.get('3. type', ''),
                    'exchange': match.get('4. region', '')
                })
            
            return results
        except Exception as e:
            print(f"Error searching stocks: {e}")
            return []
    
    def get_stock_info(self, symbol: str) -> Dict[str, Any]:
        """Get detailed information about a stock"""
        try:
            # Get overview data
            params = {
                'function': 'OVERVIEW',
                'symbol': symbol,
                'apikey': self.api_key
            }
            response = requests.get(self.base_url, params=params, timeout=15)
            overview = response.json()
            
            if 'Symbol' not in overview:
                raise ValueError(f"Stock {symbol} not found")
            
            # Get quote data
            quote_data = self.get_stock_quote(symbol)
            
            return {
                'symbol': overview.get('Symbol', symbol),
                'name': overview.get('Name', 'N/A'),
                'currency': 'USD',
                'exchange': overview.get('Exchange', 'N/A'),
                'sector': overview.get('Sector', 'N/A'),
                'industry': overview.get('Industry', 'N/A'),
                'marketCap': int(overview.get('MarketCapitalization', 0)),
                'website': overview.get('Website', ''),
                'description': overview.get('Description', ''),
                'employees': int(overview.get('FullTimeEmployees', 0)) if overview.get('FullTimeEmployees') else 0,
                'country': overview.get('Country', 'N/A'),
                'currentPrice': quote_data.get('price', 0),
                'previousClose': float(overview.get('PreviousClose', 0)) if overview.get('PreviousClose') else 0,
                'open': quote_data.get('open', 0),
                'dayLow': quote_data.get('dayLow', 0),
                'dayHigh': quote_data.get('dayHigh', 0),
                'fiftyTwoWeekLow': float(overview.get('52WeekLow', 0)) if overview.get('52WeekLow') else 0,
                'fiftyTwoWeekHigh': float(overview.get('52WeekHigh', 0)) if overview.get('52WeekHigh') else 0,
                'volume': quote_data.get('volume', 0),
                'averageVolume': int(overview.get('AverageVolume', 0)) if overview.get('AverageVolume') else 0,
                'dividendYield': float(overview.get('DividendYield', 0)) if overview.get('DividendYield') else 0,
                'beta': float(overview.get('Beta', 0)) if overview.get('Beta') else 0,
                'trailingPE': float(overview.get('TrailingPE', 0)) if overview.get('TrailingPE') else 0,
                'forwardPE': float(overview.get('ForwardPE', 0)) if overview.get('ForwardPE') else 0
            }
        except Exception as e:
            print(f"Error getting stock info: {e}")
            raise
    
    def get_stock_history(self, symbol: str, period: str = "1mo") -> List[Dict[str, Any]]:
        """Get historical data for a stock"""
        try:
            # Map period to Alpha Vantage function
            if period in ['1d', '5d']:
                data, meta_data = self.ts.get_intraday(symbol, interval='60min', outputsize='full')
            elif period in ['1mo', '3mo']:
                data, meta_data = self.ts.get_daily(symbol, outputsize='compact')
            else:
                data, meta_data = self.ts.get_daily(symbol, outputsize='full')
            
            history = []
            for date_str, values in sorted(data.items())[:30]:  # Last 30 days
                history.append({
                    'date': date_str.split()[0] if ' ' in date_str else date_str,
                    'open': float(values['1. open']),
                    'high': float(values['2. high']),
                    'low': float(values['3. low']),
                    'close': float(values['4. close']),
                    'volume': int(values['5. volume'])
                })
            
            return history
        except Exception as e:
            print(f"Error getting stock history: {e}")
            return []
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get real-time quote for a stock"""
        try:
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': self.api_key
            }
            response = requests.get(self.base_url, params=params, timeout=15)
            data = response.json()
            
            if 'Global Quote' not in data or not data['Global Quote']:
                # Fallback to getting name from overview
                params_overview = {
                    'function': 'OVERVIEW',
                    'symbol': symbol,
                    'apikey': self.api_key
                }
                overview_response = requests.get(self.base_url, params=params_overview, timeout=15)
                overview = overview_response.json()
                name = overview.get('Name', symbol)
                
                return {
                    'symbol': symbol,
                    'name': name,
                    'price': 0,
                    'change': 0,
                    'changePercent': 0,
                    'previousClose': 0,
                    'open': 0,
                    'dayLow': 0,
                    'dayHigh': 0,
                    'volume': 0,
                    'marketCap': 0,
                    'timestamp': datetime.now().isoformat()
                }
            
            quote = data['Global Quote']
            
            return {
                'symbol': quote.get('01. symbol', symbol),
                'name': symbol,  # Alpha Vantage doesn't provide name in quote
                'price': float(quote.get('05. price', 0)),
                'change': float(quote.get('09. change', 0)),
                'changePercent': float(quote.get('10. change percent', '0').replace('%', '')),
                'previousClose': float(quote.get('08. previous close', 0)),
                'open': float(quote.get('02. open', 0)),
                'dayLow': float(quote.get('04. low', 0)),
                'dayHigh': float(quote.get('03. high', 0)),
                'volume': int(quote.get('06. volume', 0)),
                'marketCap': 0,  # Need to get from overview
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error getting stock quote: {e}")
            raise
