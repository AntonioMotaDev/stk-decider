import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from app.services.alpha_vantage import AlphaVantageService
import warnings
import logging

# Suppress Prophet's plotly warning and other verbose logs
warnings.filterwarnings('ignore')
logging.getLogger('prophet').setLevel(logging.ERROR)
logging.getLogger('cmdstanpy').setLevel(logging.ERROR)

# Disable Stan backend to avoid compatibility issues
import os
os.environ['PROPHET_SUPPRESS_STAN_WARNINGS'] = '1'

from prophet import Prophet

class MLPredictionService:
    """Service for ML-based stock price prediction using Prophet"""
    
    def __init__(self):
        self.av_service = AlphaVantageService()
        self.cache = {}  # Simple in-memory cache
        self.cache_duration = timedelta(hours=24)
    
    def predict_stock_price(self, symbol: str, days: int = 7) -> Dict[str, Any]:
        """
        Predict stock prices for the next N days using Prophet
        
        Args:
            symbol: Stock symbol (e.g., 'AAPL')
            days: Number of days to predict (default: 7)
            
        Returns:
            Dictionary with predictions, confidence intervals, and metadata
        """
        cache_key = f"{symbol}_{days}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if datetime.now() - cached_time < self.cache_duration:
                return cached_data
        
        try:
            # Get historical data (last 60 days for better predictions)
            history = self.av_service.get_stock_history(symbol, period='3mo')
            
            if not history or len(history) < 30:
                raise ValueError(f"Insufficient data for {symbol}")
            
            # Prepare data for Prophet
            df = pd.DataFrame(history)
            df['ds'] = pd.to_datetime(df['date'])
            df['y'] = df['close']
            df = df[['ds', 'y']].sort_values('ds')
            
            # Train Prophet model with simplified backend
            model = Prophet(
                daily_seasonality=True,
                yearly_seasonality=False,
                weekly_seasonality=True,
                changepoint_prior_scale=0.05,  # More conservative
                interval_width=0.95,  # 95% confidence interval
                stan_backend=None  # Disable Stan backend
            )
            
            # Suppress Prophet's verbose output during training
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                model.fit(df, algorithm='Newton')
            
            # Make future predictions
            future = model.make_future_dataframe(periods=days)
            forecast = model.predict(future)
            
            # Get predictions (only future dates)
            predictions = forecast[forecast['ds'] > df['ds'].max()].copy()
            
            # Calculate trend
            current_price = float(df['y'].iloc[-1])
            predicted_price = float(predictions['yhat'].iloc[-1])
            trend = 'up' if predicted_price > current_price else 'down'
            change_percent = ((predicted_price - current_price) / current_price) * 100
            
            # Prepare prediction data
            prediction_data = []
            for _, row in predictions.iterrows():
                prediction_data.append({
                    'date': row['ds'].strftime('%Y-%m-%d'),
                    'predicted_price': float(row['yhat']),
                    'lower_bound': float(row['yhat_lower']),
                    'upper_bound': float(row['yhat_upper']),
                    'confidence': float((row['yhat_upper'] - row['yhat_lower']) / row['yhat'])
                })
            
            # Calculate model confidence (inverse of uncertainty)
            avg_uncertainty = predictions['yhat_upper'] - predictions['yhat_lower']
            confidence_score = max(0, min(100, 100 - (avg_uncertainty.mean() / current_price * 100)))
            
            result = {
                'symbol': symbol,
                'current_price': current_price,
                'predicted_price': predicted_price,
                'trend': trend,
                'change_percent': round(change_percent, 2),
                'confidence_score': round(confidence_score, 2),
                'predictions': prediction_data,
                'days_predicted': days,
                'timestamp': datetime.now().isoformat()
            }
            
            # Cache result
            self.cache[cache_key] = (result, datetime.now())
            
            return result
            
        except Exception as e:
            print(f"Error predicting {symbol}: {e}")
            raise
    
    def get_technical_signals(self, symbol: str) -> Dict[str, Any]:
        """
        Calculate technical indicators and generate signals
        
        Returns:
            Dictionary with RSI, MACD, signals, and recommendation
        """
        try:
            history = self.av_service.get_stock_history(symbol, period='3mo')
            
            if not history or len(history) < 30:
                raise ValueError(f"Insufficient data for {symbol}")
            
            df = pd.DataFrame(history)
            df = df.sort_values('date')
            df['close'] = df['close'].astype(float)
            
            # Calculate RSI
            rsi = self._calculate_rsi(df['close'], period=14)
            current_rsi = float(rsi.iloc[-1]) if len(rsi) > 0 else 50
            
            # Calculate MACD
            macd, signal, histogram = self._calculate_macd(df['close'])
            current_macd = float(macd.iloc[-1]) if len(macd) > 0 else 0
            current_signal = float(signal.iloc[-1]) if len(signal) > 0 else 0
            current_histogram = float(histogram.iloc[-1]) if len(histogram) > 0 else 0
            
            # Generate signals
            signals = []
            
            # RSI signals
            if current_rsi < 30:
                signals.append({'type': 'RSI', 'signal': 'OVERSOLD', 'strength': 'strong', 'action': 'BUY'})
            elif current_rsi > 70:
                signals.append({'type': 'RSI', 'signal': 'OVERBOUGHT', 'strength': 'strong', 'action': 'SELL'})
            
            # MACD signals
            if current_histogram > 0 and current_macd > current_signal:
                signals.append({'type': 'MACD', 'signal': 'BULLISH', 'strength': 'medium', 'action': 'BUY'})
            elif current_histogram < 0 and current_macd < current_signal:
                signals.append({'type': 'MACD', 'signal': 'BEARISH', 'strength': 'medium', 'action': 'SELL'})
            
            # Generate overall recommendation
            buy_signals = sum(1 for s in signals if s['action'] == 'BUY')
            sell_signals = sum(1 for s in signals if s['action'] == 'SELL')
            
            if buy_signals > sell_signals:
                recommendation = 'BUY'
                confidence = min(100, buy_signals * 40)
            elif sell_signals > buy_signals:
                recommendation = 'SELL'
                confidence = min(100, sell_signals * 40)
            else:
                recommendation = 'HOLD'
                confidence = 50
            
            return {
                'symbol': symbol,
                'rsi': round(current_rsi, 2),
                'macd': {
                    'macd': round(current_macd, 2),
                    'signal': round(current_signal, 2),
                    'histogram': round(current_histogram, 2)
                },
                'signals': signals,
                'recommendation': recommendation,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error calculating signals for {symbol}: {e}")
            raise
    
    def _calculate_rsi(self, prices: pd.Series, period: int = 14) -> pd.Series:
        """Calculate Relative Strength Index"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def _calculate_macd(self, prices: pd.Series, fast: int = 12, slow: int = 26, signal_period: int = 9):
        """Calculate MACD (Moving Average Convergence Divergence)"""
        exp1 = prices.ewm(span=fast, adjust=False).mean()
        exp2 = prices.ewm(span=slow, adjust=False).mean()
        macd = exp1 - exp2
        signal = macd.ewm(span=signal_period, adjust=False).mean()
        histogram = macd - signal
        return macd, signal, histogram
    
    def get_combined_analysis(self, symbol: str, prediction_days: int = 7) -> Dict[str, Any]:
        """
        Get combined analysis: predictions + technical signals
        
        Returns:
            Comprehensive analysis with recommendation
        """
        cache_key = f"{symbol}_{prediction_days}_combined"
        
        # Check cache first
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if datetime.now() - cached_time < self.cache_duration:
                return cached_data
        
        try:
            # OPTIMIZATION: Fetch historical data once and reuse
            history = self.av_service.get_stock_history(symbol, period='3mo')
            
            if not history or len(history) < 30:
                raise ValueError(f"Insufficient data for {symbol}")
            
            # Get predictions (passing history to avoid refetch)
            predictions = self._predict_with_data(symbol, prediction_days, history)
            
            # Get technical signals (using same history data)
            signals = self._calculate_signals_with_data(symbol, history)
            
            # Combine recommendations
            pred_action = 'BUY' if predictions['trend'] == 'up' else 'SELL'
            tech_action = signals['recommendation']
            
            # Final recommendation logic
            if pred_action == 'BUY' and tech_action in ['BUY', 'HOLD']:
                final_recommendation = 'STRONG BUY'
                final_confidence = min(100, (predictions['confidence_score'] + signals['confidence']) / 2 + 15)
            elif pred_action == 'SELL' and tech_action in ['SELL', 'HOLD']:
                final_recommendation = 'STRONG SELL'
                final_confidence = min(100, (predictions['confidence_score'] + signals['confidence']) / 2 + 15)
            elif pred_action == tech_action:
                final_recommendation = pred_action
                final_confidence = (predictions['confidence_score'] + signals['confidence']) / 2
            else:
                final_recommendation = 'HOLD'
                final_confidence = 50
            
            result = {
                'symbol': symbol,
                'analysis': {
                    'prediction': predictions,
                    'technical_signals': signals,
                    'final_recommendation': final_recommendation,
                    'final_confidence': round(final_confidence, 2),
                    'reasons': self._generate_reasons(predictions, signals, final_recommendation)
                },
                'timestamp': datetime.now().isoformat()
            }
            
            # Cache the combined result
            self.cache[cache_key] = (result, datetime.now())
            
            return result
            
        except Exception as e:
            print(f"Error in combined analysis for {symbol}: {e}")
            raise
    
    def _predict_with_data(self, symbol: str, days: int, history: List[Dict]) -> Dict[str, Any]:
        """
        Predict stock prices using pre-fetched historical data
        """
        try:
            # Prepare data for Prophet
            df = pd.DataFrame(history)
            df['ds'] = pd.to_datetime(df['date'])
            df['y'] = df['close']
            df = df[['ds', 'y']].sort_values('ds')
            
            # Train Prophet model with simplified backend
            model = Prophet(
                daily_seasonality=True,
                yearly_seasonality=False,
                weekly_seasonality=True,
                changepoint_prior_scale=0.05,
                interval_width=0.95,
                stan_backend=None  # Disable Stan backend
            )
            
            # Suppress Prophet's verbose output during training
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                model.fit(df, algorithm='Newton')
            
            # Make future predictions
            future = model.make_future_dataframe(periods=days)
            forecast = model.predict(future)
            
            # Get predictions (only future dates)
            predictions = forecast[forecast['ds'] > df['ds'].max()].copy()
            
            # Calculate trend
            current_price = float(df['y'].iloc[-1])
            predicted_price = float(predictions['yhat'].iloc[-1])
            trend = 'up' if predicted_price > current_price else 'down'
            change_percent = ((predicted_price - current_price) / current_price) * 100
            
            # Prepare prediction data
            prediction_data = []
            for _, row in predictions.iterrows():
                prediction_data.append({
                    'date': row['ds'].strftime('%Y-%m-%d'),
                    'predicted_price': float(row['yhat']),
                    'lower_bound': float(row['yhat_lower']),
                    'upper_bound': float(row['yhat_upper']),
                    'confidence': float((row['yhat_upper'] - row['yhat_lower']) / row['yhat'])
                })
            
            # Calculate model confidence
            avg_uncertainty = predictions['yhat_upper'] - predictions['yhat_lower']
            confidence_score = max(0, min(100, 100 - (avg_uncertainty.mean() / current_price * 100)))
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'predicted_price': predicted_price,
                'trend': trend,
                'change_percent': round(change_percent, 2),
                'confidence_score': round(confidence_score, 2),
                'predictions': prediction_data,
                'days_predicted': days,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error predicting {symbol}: {e}")
            raise
    
    def _calculate_signals_with_data(self, symbol: str, history: List[Dict]) -> Dict[str, Any]:
        """
        Calculate technical indicators using pre-fetched historical data
        """
        try:
            df = pd.DataFrame(history)
            df = df.sort_values('date')
            df['close'] = df['close'].astype(float)
            
            # Calculate RSI
            rsi = self._calculate_rsi(df['close'], period=14)
            current_rsi = float(rsi.iloc[-1]) if len(rsi) > 0 else 50
            
            # Calculate MACD
            macd, signal, histogram = self._calculate_macd(df['close'])
            current_macd = float(macd.iloc[-1]) if len(macd) > 0 else 0
            current_signal = float(signal.iloc[-1]) if len(signal) > 0 else 0
            current_histogram = float(histogram.iloc[-1]) if len(histogram) > 0 else 0
            
            # Generate signals
            signals = []
            
            # RSI signals
            if current_rsi < 30:
                signals.append({'type': 'RSI', 'signal': 'OVERSOLD', 'strength': 'strong', 'action': 'BUY'})
            elif current_rsi > 70:
                signals.append({'type': 'RSI', 'signal': 'OVERBOUGHT', 'strength': 'strong', 'action': 'SELL'})
            
            # MACD signals
            if current_histogram > 0 and current_macd > current_signal:
                signals.append({'type': 'MACD', 'signal': 'BULLISH', 'strength': 'medium', 'action': 'BUY'})
            elif current_histogram < 0 and current_macd < current_signal:
                signals.append({'type': 'MACD', 'signal': 'BEARISH', 'strength': 'medium', 'action': 'SELL'})
            
            # Generate overall recommendation
            buy_signals = sum(1 for s in signals if s['action'] == 'BUY')
            sell_signals = sum(1 for s in signals if s['action'] == 'SELL')
            
            if buy_signals > sell_signals:
                recommendation = 'BUY'
                confidence = min(100, buy_signals * 40)
            elif sell_signals > buy_signals:
                recommendation = 'SELL'
                confidence = min(100, sell_signals * 40)
            else:
                recommendation = 'HOLD'
                confidence = 50
            
            return {
                'symbol': symbol,
                'rsi': round(current_rsi, 2),
                'macd': {
                    'macd': round(current_macd, 2),
                    'signal': round(current_signal, 2),
                    'histogram': round(current_histogram, 2)
                },
                'signals': signals,
                'recommendation': recommendation,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error calculating signals for {symbol}: {e}")
            raise
    
    def _generate_reasons(self, predictions: Dict, signals: Dict, recommendation: str) -> List[str]:
        """Generate human-readable reasons for the recommendation"""
        reasons = []
        
        # Prediction-based reasons
        if predictions['trend'] == 'up':
            reasons.append(f"El modelo predice un aumento del {abs(predictions['change_percent']):.1f}% en {predictions['days_predicted']} días")
        else:
            reasons.append(f"El modelo predice una caída del {abs(predictions['change_percent']):.1f}% en {predictions['days_predicted']} días")
        
        # RSI reasons
        if signals['rsi'] < 30:
            reasons.append(f"RSI en {signals['rsi']:.0f} indica sobreventa (oportunidad de compra)")
        elif signals['rsi'] > 70:
            reasons.append(f"RSI en {signals['rsi']:.0f} indica sobrecompra (posible corrección)")
        
        # MACD reasons
        if signals['macd']['histogram'] > 0:
            reasons.append("MACD muestra momento alcista")
        elif signals['macd']['histogram'] < 0:
            reasons.append("MACD muestra momento bajista")
        
        # Signal-based reasons
        for signal in signals['signals']:
            if signal['strength'] == 'strong':
                reasons.append(f"{signal['type']}: {signal['signal']}")
        
        return reasons[:5]  # Top 5 reasons
