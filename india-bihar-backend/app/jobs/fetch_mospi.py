"""
Automatic data fetch jobs for India + Bihar Dashboard.

HOW TO ACTIVATE (later):
1. Get API key from https://www.data.gov.in
2. Put it in .env → DATA_GOV_API_KEY=your_key
3. Fill the real fetch functions below
4. Run this file or schedule it

Right now it is SAFE placeholder.
"""

from datetime import datetime
from app.database import SessionLocal, settings
from app.models import Observation, FetchLog


def _save_observation(db, location, indicator_code, value, previous, change, period, source, source_url, frequency="Monthly"):
    existing = (
        db.query(Observation)
        .filter(
            Observation.location == location,
            Observation.indicator_code == indicator_code,
            Observation.period == period,
        )
        .first()
    )
    if existing:
        existing.value = value
        existing.previous_value = previous
        existing.change = change
        existing.source = source
        existing.source_url = source_url
        existing.status = "live"
    else:
        db.add(Observation(
            location=location,
            indicator_code=indicator_code,
            value=value,
            previous_value=previous,
            change=change,
            period=period,
            source=source,
            source_url=source_url,
            frequency=frequency,
            status="live",
        ))


def fetch_india_inflation():
    """Fetch latest India CPI inflation. Placeholder until API key + endpoint ready."""
    db = SessionLocal()
    try:
        # REAL CODE example (later):
        # import httpx
        # url = "https://api.data.gov.in/resource/XXXX"
        # params = {"api-key": settings.DATA_GOV_API_KEY, "format": "json"}
        # r = httpx.get(url, params=params, timeout=30)
        # value = ...
        # _save_observation(db, "india", "inflation", value, ...)

        log = FetchLog(
            source="MoSPI CPI",
            status="pending",
            message="Placeholder only. Add DATA_GOV_API_KEY + real endpoint to activate."
        )
        db.add(log)
        db.commit()
        print(f"[{datetime.now()}] Inflation job: placeholder (not live yet)")
        return True
    except Exception as e:
        db.rollback()
        db.add(FetchLog(source="MoSPI CPI", status="failed", message=str(e)))
        db.commit()
        print("Inflation fetch failed:", e)
        return False
    finally:
        db.close()


def fetch_india_unemployment():
    """Placeholder for PLFS unemployment."""
    db = SessionLocal()
    try:
        log = FetchLog(
            source="MoSPI PLFS",
            status="pending",
            message="Placeholder — connect PLFS source later."
        )
        db.add(log)
        db.commit()
        print(f"[{datetime.now()}] Unemployment job: placeholder")
        return True
    except Exception as e:
        db.rollback()
        print("Unemployment fetch failed:", e)
        return False
    finally:
        db.close()


def run_all_jobs():
    print("=" * 50)
    print("Running scheduled fetch jobs...")
    fetch_india_inflation()
    fetch_india_unemployment()
    print("All jobs finished.")
    print("=" * 50)


if __name__ == "__main__":
    run_all_jobs()
