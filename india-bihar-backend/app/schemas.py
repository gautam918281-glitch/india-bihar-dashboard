from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ObservationOut(BaseModel):
    location: str
    indicator_code: str
    value: Optional[float] = None
    previous_value: Optional[float] = None
    change: Optional[str] = None
    unit: str = "%"
    period: str
    source: str
    source_url: Optional[str] = None
    frequency: str = "Monthly"
    status: str = "live"
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True


class LocationData(BaseModel):
    location: str
    indicators: dict


class HealthResponse(BaseModel):
    status: str
    app: str
    message: str
