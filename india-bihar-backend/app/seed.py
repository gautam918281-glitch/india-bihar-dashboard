"""
Seed initial official data (same numbers we put in the frontend).
Later the fetch jobs will update these automatically.
"""
from app.database import SessionLocal, engine, Base
from app.models import Indicator, Observation


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Indicators
    indicators = [
        {"code": "inflation", "name_en": "Inflation (Price Rise)", "name_hi": "महँगाई", "unit": "%"},
        {"code": "unemployment", "name_en": "Unemployment", "name_hi": "बेरोजगारी", "unit": "%"},
        {"code": "literacy", "name_en": "Literacy", "name_hi": "साक्षरता", "unit": "%"},
        {"code": "lifeExpectancy", "name_en": "Life Expectancy", "name_hi": "औसत आयु", "unit": "years"},
        {"code": "electricity", "name_en": "Electricity Access", "name_hi": "बिजली पहुँच", "unit": "%"},
        {"code": "poverty", "name_en": "Multidimensional Poverty", "name_hi": "बहुआयामी गरीबी", "unit": "%"},
    ]

    for item in indicators:
        exists = db.query(Indicator).filter(Indicator.code == item["code"]).first()
        if not exists:
            db.add(Indicator(**item))

    # Official seed data (India + Bihar)
    observations = [
        # India
        {
            "location": "india", "indicator_code": "inflation",
            "value": 4.82, "previous_value": 4.45, "change": "+0.37",
            "period": "August 2026 (Provisional)", "source": "MoSPI — CPI (Base 2024=100)",
            "source_url": "https://cpi.mospi.gov.in/", "frequency": "Monthly", "status": "live"
        },
        {
            "location": "india", "indicator_code": "unemployment",
            "value": 5.0, "previous_value": 5.1, "change": "-0.1",
            "period": "August 2026 (PLFS monthly)", "source": "MoSPI — PLFS",
            "source_url": "https://www.mospi.gov.in/", "frequency": "Monthly", "status": "live"
        },
        {
            "location": "india", "indicator_code": "literacy",
            "value": 80.9, "previous_value": 77.7, "change": "+3.2",
            "period": "PLFS 2023-24 (age 7+)", "source": "MoSPI — PLFS",
            "source_url": "https://www.mospi.gov.in/", "frequency": "Annual", "status": "live"
        },
        {
            "location": "india", "indicator_code": "lifeExpectancy",
            "value": 70.3, "previous_value": 69.9, "change": "+0.4",
            "period": "SRS 2019-23", "source": "SRS — Registrar General of India",
            "source_url": "https://censusindia.gov.in/", "frequency": "Annual", "status": "live"
        },
        {
            "location": "india", "indicator_code": "electricity",
            "value": 99.5, "previous_value": 96.0, "change": "+3.5",
            "period": "Recent official estimate", "source": "Ministry of Power",
            "source_url": "https://powermin.gov.in/", "frequency": "Periodic", "status": "live"
        },
        {
            "location": "india", "indicator_code": "poverty",
            "value": 14.96, "previous_value": 24.85, "change": "-9.89",
            "period": "NFHS-5 (2019-21)", "source": "NITI Aayog MPI",
            "source_url": "https://www.niti.gov.in/", "frequency": "Periodic", "status": "live"
        },
        # Bihar
        {
            "location": "br", "indicator_code": "unemployment",
            "value": 3.0, "previous_value": 3.9, "change": "-0.9",
            "period": "PLFS 2023-24 (usual status)", "source": "MoSPI — PLFS",
            "source_url": "https://www.mospi.gov.in/", "frequency": "Annual", "status": "live"
        },
        {
            "location": "br", "indicator_code": "literacy",
            "value": 74.3, "previous_value": 61.8, "change": "+12.5",
            "period": "PLFS 2023-24 (age 7+)", "source": "MoSPI — PLFS",
            "source_url": "https://www.mospi.gov.in/", "frequency": "Annual", "status": "live"
        },
        {
            "location": "br", "indicator_code": "lifeExpectancy",
            "value": 69.3, "previous_value": 69.0, "change": "+0.3",
            "period": "SRS 2019-23", "source": "SRS — RGI",
            "source_url": "https://censusindia.gov.in/", "frequency": "Annual", "status": "live"
        },
        {
            "location": "br", "indicator_code": "poverty",
            "value": 33.76, "previous_value": 51.89, "change": "-18.13",
            "period": "NFHS-5 (2019-21)", "source": "NITI Aayog MPI",
            "source_url": "https://www.niti.gov.in/", "frequency": "Periodic", "status": "live"
        },
    ]

    for obs in observations:
        exists = db.query(Observation).filter(
            Observation.location == obs["location"],
            Observation.indicator_code == obs["indicator_code"],
            Observation.period == obs["period"]
        ).first()
        if not exists:
            db.add(Observation(**obs))

    db.commit()
    db.close()
    print("Seed completed: India + Bihar official data loaded.")


if __name__ == "__main__":
    seed()
