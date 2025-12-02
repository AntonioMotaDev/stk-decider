from typing import List, Dict, Any
import requests
from app.core.config import settings

class StockScreenerService:
    """Service for screening and filtering stocks"""
    
    def __init__(self):
        self.api_key = settings.ALPHA_VANTAGE_API_KEY
        self.base_url = "https://www.alphavantage.co/query"
    
    # Popular stock symbols to screen
    DEFAULT_SYMBOLS = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX',
        'JPM', 'BAC', 'WFC', 'GS', 'V', 'MA', 'DIS', 'KO',
        'PFE', 'JNJ', 'UNH', 'WMT', 'HD', 'NKE', 'INTC', 'AMD'
    ]
    
    def get_undervalued_stocks(self, symbols: List[str] = None) -> List[Dict[str, Any]]:
        """Get stocks that appear undervalued based on various metrics"""
        if symbols is None:
            symbols = self.DEFAULT_SYMBOLS
        
        undervalued_stocks = []
        
        for symbol in symbols:
            try:
                # Get overview data from Alpha Vantage
                params = {
                    'function': 'OVERVIEW',
                    'symbol': symbol,
                    'apikey': self.api_key
                }
                response = requests.get(self.base_url, params=params)
                info = response.json()
                
                if 'Symbol' not in info:
                    continue
                
                # Get key metrics from Alpha Vantage
                pe_ratio = float(info.get('TrailingPE', 0)) if info.get('TrailingPE') and info.get('TrailingPE') != 'None' else 0
                peg_ratio = float(info.get('PEGRatio', 0)) if info.get('PEGRatio') and info.get('PEGRatio') != 'None' else 0
                pb_ratio = float(info.get('PriceToBookRatio', 0)) if info.get('PriceToBookRatio') and info.get('PriceToBookRatio') != 'None' else 0
                current_price = float(info.get('AnalystTargetPrice', 0)) if info.get('AnalystTargetPrice') else 0
                target_price = float(info.get('AnalystTargetPrice', 0)) if info.get('AnalystTargetPrice') else 0
                
                # Get quote for current price
                quote_params = {
                    'function': 'GLOBAL_QUOTE',
                    'symbol': symbol,
                    'apikey': self.api_key
                }
                quote_response = requests.get(self.base_url, params=quote_params)
                quote_data = quote_response.json()
                
                if 'Global Quote' in quote_data and quote_data['Global Quote']:
                    current_price = float(quote_data['Global Quote'].get('05. price', 0))
                
                # Calculate potential upside
                upside = 0
                if current_price and target_price:
                    upside = ((target_price - current_price) / current_price) * 100
                
                # Criteria for undervalued (customize as needed)
                is_undervalued = False
                reasons = []
                
                if pe_ratio and 0 < pe_ratio < 20:
                    is_undervalued = True
                    reasons.append("Low P/E ratio")
                
                if peg_ratio and 0 < peg_ratio < 1:
                    is_undervalued = True
                    reasons.append("Low PEG ratio")
                
                if upside > 15:
                    is_undervalued = True
                    reasons.append("High upside potential")
                
                if is_undervalued:
                    change = float(quote_data.get('Global Quote', {}).get('09. change', 0)) if 'Global Quote' in quote_data else 0
                    change_percent = float(quote_data.get('Global Quote', {}).get('10. change percent', '0').replace('%', '')) if 'Global Quote' in quote_data else 0
                    
                    stock_data = {
                        'symbol': symbol,
                        'name': info.get('Name', symbol),
                        'currentPrice': current_price,
                        'targetPrice': target_price,
                        'upside': round(upside, 2),
                        'peRatio': round(pe_ratio, 2) if pe_ratio else None,
                        'pegRatio': round(peg_ratio, 2) if peg_ratio else None,
                        'pbRatio': round(pb_ratio, 2) if pb_ratio else None,
                        'marketCap': int(info.get('MarketCapitalization', 0)),
                        'volume': int(quote_data.get('Global Quote', {}).get('06. volume', 0)) if 'Global Quote' in quote_data else 0,
                        'averageVolume': int(info.get('AverageVolume', 0)) if info.get('AverageVolume') else 0,
                        'change': change,
                        'changePercent': change_percent,
                        'fiftyTwoWeekLow': float(info.get('52WeekLow', 0)) if info.get('52WeekLow') else 0,
                        'fiftyTwoWeekHigh': float(info.get('52WeekHigh', 0)) if info.get('52WeekHigh') else 0,
                        'dividendYield': float(info.get('DividendYield', 0)) if info.get('DividendYield') else 0,
                        'reasons': reasons,
                        'sector': info.get('Sector', 'N/A'),
                        'industry': info.get('Industry', 'N/A')
                    }
                    undervalued_stocks.append(stock_data)
            
            except Exception as e:
                print(f"Error processing {symbol}: {e}")
                continue
        
        # Sort by upside potential
        undervalued_stocks.sort(key=lambda x: x['upside'], reverse=True)
        
        return undervalued_stocks
    
    def get_top_gainers(self, symbols: List[str] = None) -> List[Dict[str, Any]]:
        """Get stocks with highest gains today"""
        if symbols is None:
            symbols = self.DEFAULT_SYMBOLS
        
        gainers = []
        
        for symbol in symbols:
            try:
                # Get quote data
                quote_params = {
                    'function': 'GLOBAL_QUOTE',
                    'symbol': symbol,
                    'apikey': self.api_key
                }
                quote_response = requests.get(self.base_url, params=quote_params)
                quote_data = quote_response.json()
                
                if 'Global Quote' not in quote_data or not quote_data['Global Quote']:
                    continue
                
                quote = quote_data['Global Quote']
                change_percent = float(quote.get('10. change percent', '0').replace('%', ''))
                
                if change_percent > 0:
                    # Get market cap from overview
                    overview_params = {
                        'function': 'OVERVIEW',
                        'symbol': symbol,
                        'apikey': self.api_key
                    }
                    overview_response = requests.get(self.base_url, params=overview_params)
                    overview = overview_response.json()
                    
                    stock_data = {
                        'symbol': symbol,
                        'name': overview.get('Name', symbol),
                        'currentPrice': float(quote.get('05. price', 0)),
                        'change': float(quote.get('09. change', 0)),
                        'changePercent': round(change_percent, 2),
                        'volume': int(quote.get('06. volume', 0)),
                        'marketCap': int(overview.get('MarketCapitalization', 0))
                    }
                    gainers.append(stock_data)
            
            except Exception as e:
                print(f"Error processing {symbol}: {e}")
                continue
        
        # Sort by change percent
        gainers.sort(key=lambda x: x['changePercent'], reverse=True)
        
        return gainers[:10]  # Top 10
    
    def get_top_losers(self, symbols: List[str] = None) -> List[Dict[str, Any]]:
        """Get stocks with highest losses today"""
        if symbols is None:
            symbols = self.DEFAULT_SYMBOLS
        
        losers = []
        
        for symbol in symbols:
            try:
                # Get quote data
                quote_params = {
                    'function': 'GLOBAL_QUOTE',
                    'symbol': symbol,
                    'apikey': self.api_key
                }
                quote_response = requests.get(self.base_url, params=quote_params)
                quote_data = quote_response.json()
                
                if 'Global Quote' not in quote_data or not quote_data['Global Quote']:
                    continue
                
                quote = quote_data['Global Quote']
                change_percent = float(quote.get('10. change percent', '0').replace('%', ''))
                
                if change_percent < 0:
                    # Get market cap from overview
                    overview_params = {
                        'function': 'OVERVIEW',
                        'symbol': symbol,
                        'apikey': self.api_key
                    }
                    overview_response = requests.get(self.base_url, params=overview_params)
                    overview = overview_response.json()
                    
                    stock_data = {
                        'symbol': symbol,
                        'name': overview.get('Name', symbol),
                        'currentPrice': float(quote.get('05. price', 0)),
                        'change': float(quote.get('09. change', 0)),
                        'changePercent': round(change_percent, 2),
                        'volume': int(quote.get('06. volume', 0)),
                        'marketCap': int(overview.get('MarketCapitalization', 0))
                    }
                    losers.append(stock_data)
            
            except Exception as e:
                print(f"Error processing {symbol}: {e}")
                continue
        
        # Sort by change percent (ascending, most negative first)
        losers.sort(key=lambda x: x['changePercent'])
        
        return losers[:10]  # Top 10
