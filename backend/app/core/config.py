from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://crewdeck_user:crewdeck_password@db:5432/crewdeck_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App
    APP_NAME: str = "CrewDeck"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Cerebras (replacing OpenAI)
    CEREBRAS_API_KEY: Optional[str] = None
    CEREBRAS_MODEL: str = "llama3.1-70b"  # Default Cerebras model
    
    # Legacy OpenAI support (for tools that might still need it)
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()