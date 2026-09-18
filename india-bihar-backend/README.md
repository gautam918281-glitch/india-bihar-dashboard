# India + Bihar Dashboard — Backend

Simple FastAPI backend for the citizen dashboard.

## What this does right now

- Serves official India + Bihar indicator data via API
- Uses a local SQLite database (easy, no extra install)
- Seed data already loaded (same numbers as frontend)
- Placeholder ready for automatic MoSPI / data.gov.in fetch jobs

## How to run (on computer)

### 1. Install Python 3.10+

### 2. Open terminal in this folder and run:

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install packages
pip install -r requirements.txt

# Run the API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Open in browser:

- API Home: http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs
- India data: http://127.0.0.1:8000/api/indicators/india
- Bihar data: http://127.0.0.1:8000/api/indicators/br

## API Key (later)

1. Go to https://www.data.gov.in and create account
2. Generate API Key
3. Copy `.env.example` to `.env`
4. Put your key in `DATA_GOV_API_KEY=...`

Then we will connect the real fetch jobs.

## Project structure

```
india-bihar-backend/
├── app/
│   ├── main.py          ← API routes
│   ├── database.py      ← DB connection
│   ├── models.py        ← Tables
│   ├── schemas.py       ← Response format
│   ├── seed.py          ← Initial official data
│   └── jobs/
│       └── fetch_mospi.py  ← Future automatic fetch
├── requirements.txt
├── .env.example
└── README.md
```

## Next steps

1. You get data.gov.in API Key
2. We connect real MoSPI inflation endpoint
3. Add scheduled job (runs every day)
4. Connect frontend dashboard to this API
5. Deploy online
