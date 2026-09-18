from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base


class Indicator(Base):
    """Master list of indicators e.g. inflation, unemployment"""
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)  # inflation, unemployment...
    name_en = Column(String(200), nullable=False)
    name_hi = Column(String(200), nullable=False)
    unit = Column(String(20), default="%")
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)


class Observation(Base):
    """Actual values for a location + indicator + period"""
    __tablename__ = "observations"
    __table_args__ = (
        UniqueConstraint("location", "indicator_code", "period", name="uq_obs"),
    )

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(20), nullable=False, index=True)  # india / br
    indicator_code = Column(String(50), nullable=False, index=True)
    value = Column(Float, nullable=True)
    previous_value = Column(Float, nullable=True)
    change = Column(String(20), nullable=True)
    unit = Column(String(20), default="%")
    period = Column(String(100), nullable=False)  # e.g. August 2026
    source = Column(String(200), nullable=False)
    source_url = Column(String(500), nullable=True)
    frequency = Column(String(50), default="Monthly")
    status = Column(String(20), default="live")  # live / demo
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    notes = Column(Text, nullable=True)


class FetchLog(Base):
    """Track when we last tried to fetch data"""
    __tablename__ = "fetch_logs"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(100), nullable=False)
    status = Column(String(20), nullable=False)  # success / failed
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
