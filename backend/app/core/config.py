from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000"
    ENVIRONMENT: str = "development"
    ALPHA_VANTAGE_API_KEY: str = "demo"  # Default demo key, replace with your own
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS as a comma-separated list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()
