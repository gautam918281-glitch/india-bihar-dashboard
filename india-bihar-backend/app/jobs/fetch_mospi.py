"""
Automatic MoSPI CPI data fetcher
India + Bihar Dashboard
"""

from datetime import datetime
import ssl
import httpx

MOSPI_SSL_CONTEXT = ssl.create_default_context()
MOSPI_SSL_CONTEXT.options |= ssl.OP_LEGACY_SERVER_CONNECT

from app.database import SessionLocal
from app.models import Observation, FetchLog


MOSPI_CPI_URL = "https://api.mospi.gov.in/api/cpi/getCPIData"


def _save_observation(
    db,
    location,
    indicator_code,
    value,
    previous,
    change,
    period,
    source,
    source_url,
    frequency="Monthly",
):
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
        db.add(
            Observation(
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
            )
        )


def fetch_bihar_inflation():
    db = SessionLocal()

    try:
        now = datetime.now()

        months_to_try = []

        for i in range(3):
            month = now.month - i
            year = now.year

            if month <= 0:
                month += 12
                year -= 1

            months_to_try.append((year, month))

        result = None

        for year, month in months_to_try:

            params = {
                "base_year": 2024,
                "year": year,
                "month_code": month,
                "state_code": 6,
                "sector_code": 3,
                "limit": 20,
                "page": 1,
            }

            response = httpx.get(
    MOSPI_CPI_URL,
    params=params,
    verify=MOSPI_SSL_CONTEXT,
    timeout=30,
            )

            

            response.raise_for_status()

            payload = response.json()

            records = payload.get("data", [])

            for record in records:
                if (
                    record.get("state") == "Bihar"
                    and record.get("sector") == "Combined"
                    and record.get("division") == "CPI (General)"
                ):
                    result = record
                    break

            if result:
                break

        if not result:
            raise Exception("Latest Bihar CPI data not found")

        value = result.get("inflation")

        if value is None:
            raise Exception("Inflation value missing")

        value = float(value)

        period = f"{result['year']}-{result['month']}"

        _save_observation(
            db=db,
            location="br",
            indicator_code="inflation",
            value=value,
            previous=None,
            change=None,
            period=period,
            source="MoSPI CPI",
            source_url=MOSPI_CPI_URL,
            frequency="Monthly",
        )

        db.add(
            FetchLog(
                source="MoSPI CPI",
                status="success",
                message=(
                    f"Bihar CPI updated: "
                    f"{period}, inflation={value}%"
                ),
            )
        )

        db.commit()

        print(
            f"[{datetime.now()}] "
            f"Bihar CPI updated: {value}% ({period})"
        )

        return True

    except Exception as e:

        db.rollback()

        db.add(
            FetchLog(
                source="MoSPI CPI",
                status="failed",
                message=str(e),
            )
        )

        db.commit()

        print("Bihar CPI fetch failed:", e)

        return False

    finally:
        db.close()


def fetch_india_inflation():
    db = SessionLocal()

    try:
        now = datetime.now()

        months_to_try = []

        for i in range(3):
            month = now.month - i
            year = now.year

            if month <= 0:
                month += 12
                year -= 1

            months_to_try.append((year, month))

        result = None

        for year, month in months_to_try:

            params = {
                "base_year": 2024,
                "year": year,
                "month_code": month,
                "sector_code": 3,
                "limit": 20,
                "page": 1,
            }

            response = httpx.get(
                MOSPI_CPI_URL,
                params=params,
                verify=MOSPI_SSL_CONTEXT,
                timeout=30,
            )

            response.raise_for_status()

            payload = response.json()
            records = payload.get("data", [])

            for record in records:
                if (
                    record.get("state") == "ALL India"
                    and record.get("sector") == "Combined"
                    and record.get("division") == "CPI (General)"
                ):
                    result = record
                    break

            if result:
                break

        if not result:
            raise Exception("Latest India CPI data not found")

        value = result.get("inflation")

        if value is None:
            raise Exception("Inflation value missing")

        value = float(value)

        period = f"{result['year']}-{result['month']}"

        _save_observation(
            db=db,
            location="india",
            indicator_code="inflation",
            value=value,
            previous=None,
            change=None,
            period=period,
            source="MoSPI CPI",
            source_url=MOSPI_CPI_URL,
            frequency="Monthly",
        )

        db.add(
            FetchLog(
                source="MoSPI CPI",
                status="success",
                message=f"India CPI updated: {period}, inflation={value}%",
            )
        )

        db.commit()

        print(
            f"[{datetime.now()}] "
            f"India CPI updated: {value}% ({period})"
        )

        return True

    except Exception as e:

        db.rollback()

        db.add(
            FetchLog(
                source="MoSPI CPI",
                status="failed",
                message=f"India CPI: {e}",
            )
        )

        db.commit()

        print("India CPI fetch failed:", e)

        return False

    finally:
        db.close()


def fetch_india_unemployment():

    db = SessionLocal()

    try:

        db.add(
            FetchLog(
                source="MoSPI PLFS",
                status="pending",
                message="PLFS integration not activated yet.",
            )
        )

        db.commit()

        print(
            f"[{datetime.now()}] "
            "Unemployment job: pending"
        )

        return True

    except Exception as e:

        db.rollback()

        print("Unemployment fetch failed:", e)

        return False

    finally:
        db.close()


def run_all_jobs():

    print("=" * 60)
    print("Running MoSPI data fetch jobs...")
    print("=" * 60)

    fetch_india_inflation()
    fetch_india_unemployment()

    print("=" * 60)
    print("All jobs finished.")
    print("=" * 60)


if __name__ == "__main__":
    run_all_jobs()
