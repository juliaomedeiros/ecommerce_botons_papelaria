import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@postgres:5432/tutaspaper")
    SECRET_KEY: str = os.getenv("JWT_SECRET", "tutaspaper_super_secret_jwt_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 horas

    class Config:
        env_file = ".env"

settings = Settings()
