from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import threading
import time
from app.database import get_db, settings, engine, Base
from app.models import Observation, Indicator
from app.schemas import ObservationOut, HealthResponse
from app.seed import seed

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="India + Bihar Citizen Dashboard API — official data",
    version="0.1.0"
)

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def automatic_mospi_fetch():
    from app.jobs.fetch_mospi import (
        fetch_bihar_inflation,
        fetch_india_inflation
    )

    while True:
        try:
            fetch_bihar_inflation()
            fetch_india_inflation()
        except Exception as e:
            print("Automatic MoSPI fetch failed:", e)

        time.sleep(24 * 60 * 60)
            

@app.on_event("startup")
def start_automatic_mospi_fetch():
    thread = threading.Thread(
        target=automatic_mospi_fetch,
        daemon=True
    )
    thread.start()

@app.on_event("startup")
def on_startup():
    # Load seed data if empty
    seed()


@app.get("/", response_model=HealthResponse)
def health():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "message": "India + Bihar Dashboard API is running"
    }


@app.get("/api/indicators/{location}")
def get_location_data(location: str, db: Session = Depends(get_db)):
    """
    Get all latest indicators for a location.
    location = india | br
    """
    location = location.lower()
    if location not in ("india", "br"):
        raise HTTPException(status_code=400, detail="location must be 'india' or 'br'")

    rows = (
        db.query(Observation)
        .filter(Observation.location == location)
        .order_by(Observation.indicator_code, Observation.last_updated.desc())
        .all()
    )

    # Keep only latest per indicator
    latest = {}
    for row in rows:
        if row.indicator_code not in latest:
            latest[row.indicator_code] = {
                "id": row.indicator_code,
                "value": str(row.value) if row.value is not None else "—",
                "previous": str(row.previous_value) if row.previous_value is not None else "—",
                "change": row.change,
                "unit": row.unit,
                "period": row.period,
                "source": row.source,
                "sourceUrl": row.source_url,
                "frequency": row.frequency,
                "status": row.status,
                "lastUpdated": row.last_updated.isoformat() if row.last_updated else None,
            }

    return {
        "location": location,
        "indicators": latest,
        "count": len(latest)
    }


@app.get("/api/indicator/{location}/{code}", response_model=ObservationOut)
def get_one_indicator(location: str, code: str, db: Session = Depends(get_db)):
    row = (
        db.query(Observation)
        .filter(Observation.location == location.lower(), Observation.indicator_code == code)
        .order_by(Observation.last_updated.desc())
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return row


@app.get("/api/locations")
def list_locations():
    return {
        "locations": [
            {"id": "india", "en": "India", "hi": "भारत"},
            {"id": "br", "en": "Bihar", "hi": "बिहार"}
        ]
    }
