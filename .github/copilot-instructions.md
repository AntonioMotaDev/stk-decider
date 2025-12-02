# STK Decider - Project Guidelines

## Project Overview
Full-stack financial application with FastAPI backend and Next.js frontend for real-time stock data analysis.

## Architecture
- **Backend**: Python + FastAPI + Yahoo Finance API
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Deployment**: Docker + Heroku ready

## Color Palette
- Ink Black: #02111b
- Gunmetal: #3f4045
- Shadow Grey: #30292f
- Blue Slate: #5d737e
- White: #fcfcfc

## Progress Checklist
- [x] Create copilot-instructions.md file
- [x] Get project setup information
- [x] Scaffold backend (FastAPI)
- [x] Scaffold frontend (Next.js)
- [x] Create Docker configuration
- [x] Create deployment configuration
- [x] Create documentation
- [x] Install dependencies and test
- [x] Implement stock screener
- [x] Migrate to Alpha Vantage API
- [x] Implement Machine Learning predictions (Prophet)
- [x] Add technical analysis (RSI, MACD)
- [x] Create ML frontend components
- [x] Complete ML documentation

## Project Status
✅ **COMPLETED** - All features implemented successfully!

### Latest Addition: Machine Learning Features 🤖
- **Prophet Price Predictions**: 7-30 day forecasts with confidence intervals
- **Technical Indicators**: RSI, MACD with automated signals
- **AI Recommendations**: STRONG BUY/BUY/HOLD/SELL/STRONG SELL
- **Interactive Charts**: Beautiful visualizations with confidence bands
- **Smart Caching**: 24-hour cache for optimal performance

## Quick Start
```bash
# Backend (Terminal 1)
cd backend
source ../.venv/bin/activate  # On Linux/Mac
uvicorn app.main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

Or use the convenience script:
```bash
./start.sh
```
