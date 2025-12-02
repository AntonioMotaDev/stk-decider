from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import stocks, screener, predictions

app = FastAPI(
    title="STK Decider API",
    description="Real-time stock data analysis API with ML predictions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stocks.router, prefix="/api/stocks", tags=["stocks"])
app.include_router(screener.router, prefix="/api/screener", tags=["screener"])
app.include_router(predictions.router, prefix="/api/ml", tags=["ml-predictions"])

@app.get("/")
async def root():
    return {
        "message": "STK Decider API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
