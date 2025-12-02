# STK Decider

Stock data analysis application with FastAPI backend and Next.js frontend. (Demo)

## Features

- **Real-time Stock Data**: Fetch live stock information from Alpha Vantage API
- **Machine Learning Predictions**: Price forecasting using Prophet (Facebook's time series model)
- **Technical Analysis**: RSI, MACD indicators with automated trading signals
- **AI Recommendations**: STRONG BUY/BUY/HOLD/SELL/STRONG SELL with confidence scores
- **Stock Screener**: Discover undervalued stocks, top gainers, and losers
- **Interactive Charts**: Visualize historical price data and future predictions
- **Theme Switching**: Toggle between light and dark themes
- **Modern UI**: Beautiful, responsive interface with custom color palette
- **Scalable Architecture**: Modular backend and frontend structure
- **Docker Ready**: Containerized for easy deployment
- **Cloud Deployment**: Ready for Heroku and other cloud platforms

## Prerequisites

- Python 3.11+
- Node.js 18+
- Alpha Vantage API Key (free at https://www.alphavantage.co/support/#api-key)
- Docker (optional, for containerized deployment)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies (including ML libraries):
```bash
pip install -r requirements.txt
# This includes: Prophet, scikit-learn, transformers, torch
```

> **Note**: ML libraries (especially Prophet and torch) may take 5-10 minutes to install.

4. Create a `.env` file and add your Alpha Vantage API key:
```bash
cp .env.example .env
# Edit .env and replace 'demo' with your API key
# ALPHA_VANTAGE_API_KEY=your_api_key_here
```

**Get your free API key at**: https://www.alphavantage.co/support/#api-key

5. Run the backend:
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Docker Deployment

Run both backend and frontend with Docker Compose:

```bash
docker-compose up --build
```

Access the application:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## Heroku Deployment

### Backend Deployment

1. Create a Heroku app:
```bash
heroku create your-app-name-backend
```

2. Set environment variables:
```bash
heroku config:set CORS_ORIGINS=https://your-frontend-url.herokuapp.com
```

3. Deploy:
```bash
cd backend
git push heroku main
```

### Frontend Deployment

1. Create a Heroku app:
```bash
heroku create your-app-name-frontend
```

2. Set environment variables:
```bash
heroku config:set NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
```

3. Deploy:
```bash
cd frontend
git push heroku main
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Main Endpoints

**Stock Data:**
- `GET /api/stocks/search/{query}` - Search for stocks
- `GET /api/stocks/info/{symbol}` - Get detailed stock information
- `GET /api/stocks/history/{symbol}` - Get historical price data
- `GET /api/stocks/quote/{symbol}` - Get real-time quote

**Stock Screener:**
- `GET /api/screener/undervalued` - Get undervalued stocks
- `GET /api/screener/gainers` - Get top gaining stocks
- `GET /api/screener/losers` - Get top losing stocks

**Machine Learning Predictions:**
- `GET /api/ml/predict/{symbol}?days=7` - Get price predictions
- `GET /api/ml/signals/{symbol}` - Get technical indicators and signals
- `GET /api/ml/analyze/{symbol}?days=7` - Get comprehensive analysis with recommendation


## Project Structure

```
stk-decider/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes (stocks, screener, predictions)
│   │   ├── core/          # Configuration
│   │   ├── schemas/       # Pydantic models (stock, screener, prediction)
│   │   └── services/      # Business logic (Alpha Vantage, ML prediction)
│   ├── requirements.txt   # Including ML libraries
│   ├── Dockerfile
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages (search, screener, predict)
│   │   ├── components/    # React components (charts, cards, tables)
│   │   ├── context/       # React context (theme)
│   │   ├── lib/           # Utilities (API client)
│   │   └── types/         # TypeScript types (stock, screener, prediction)
│   ├── package.json
│   ├── Dockerfile
│   └── Procfile
├── docs/                  # Documentation
│   ├── ALPHA_VANTAGE.md   # Alpha Vantage API guide
│   ├── API_EXAMPLES.md    # API usage examples
│   ├── DEVELOPMENT.md     # Development guide
│   └── ML_FEATURES.md     # Machine Learning documentation
└── docker-compose.yml
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Development

### Backend
- FastAPI with automatic OpenAPI documentation
- Alpha Vantage API integration
- **Prophet** for time series forecasting
- **Scikit-learn** for technical indicators
- Pydantic for data validation
- CORS middleware configured
- In-memory caching (24h TTL)

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- **Interactive prediction charts** with confidence bands
- **Technical indicator visualizations** (RSI, MACD)
- Lucide React for icons
- Theme switching with Context API

## Environment Variables

### Backend (.env)
```env
PORT=8000
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Machine Learning Features

STK Decider includes powerful ML capabilities for stock analysis:

### Price Prediction
- **Prophet Model**: Facebook's time series forecasting
- **7-30 Day Forecasts**: Configurable prediction periods
- **Confidence Intervals**: Upper and lower bounds for predictions
- **Trend Analysis**: Automatic up/down trend detection

### Technical Analysis
- **RSI (Relative Strength Index)**: Overbought/oversold detection
- **MACD**: Momentum and trend following indicator
- **Automated Signals**: BUY/SELL/HOLD recommendations
- **Signal Strength**: Weak/medium/strong classifications

### Combined Analysis
- **Final Recommendation**: STRONG BUY, BUY, HOLD, SELL, STRONG SELL
- **Confidence Scores**: 0-100% confidence in recommendations
- **Human-Readable Reasons**: Clear explanations for recommendations
- **24h Caching**: Optimized performance with intelligent caching


### ML Limitations
**Important**: This tool provides **educational analysis only** and does NOT constitute financial advice. Always:
- Conduct your own research
- Consult professional financial advisors
- Understand investment risks
- Never invest more than you can afford to lose

**Past performance does NOT guarantee future results.**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- **Alpha Vantage** for stock market data API
- **Facebook Prophet** for time series forecasting
- **FastAPI** for the backend framework
- **Next.js** for the frontend framework
- **Tailwind CSS** for styling
- **Lucide React** for beautiful icons


---

 Readme.md last modified at 02/12/2025 