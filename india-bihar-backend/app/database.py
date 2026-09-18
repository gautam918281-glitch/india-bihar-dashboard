from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./india_bihar.db"  # default: simple local file DB
    DATA_GOV_API_KEY: str = ""
    APP_NAME: str = "India Bihar Dashboard API"
    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings = Settings()

# SQLite is easiest to start (no install needed). Later switch to PostgreSQL.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
