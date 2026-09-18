# India + Bihar Dashboard — Poora Setup Guide (Simple)

## Abhi kya ready hai

1. **Frontend Dashboard** (India + Bihar only)
   - Real official numbers already inside
   - API se data lene ke liye ready (`config.js`)

2. **Backend API**
   - FastAPI + Database
   - India + Bihar data seeded
   - Automatic fetch ke liye placeholder ready

---

## Tumhe abhi kya karna hai (Phone se)

### Step A: API Key nikaalo
1. Browser mein jao → https://www.data.gov.in
2. Sign Up / Register karo
3. Login karke **API Key** generate karo
4. Key ko notepad mein save kar lo

Jab mil jaye, mujhe bata dena.

---

## Jab Computer mile — yeh steps follow karo

### Step 1: Python install
- https://www.python.org/downloads/
- Install karte time “Add Python to PATH” tick karna

### Step 2: VS Code install
- https://code.visualstudio.com

### Step 3: Backend chalana

```bash
# 1. india-bihar-backend folder kholo
cd india-bihar-backend

# 2. Virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# 3. Packages install
pip install -r requirements.txt

# 4. Server start
uvicorn app.main:app --reload --port 8000
```

Browser mein check karo:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/api/indicators/india
- http://127.0.0.1:8000/api/indicators/br

### Step 4: Frontend ko API se jodna

1. `india-dev-control-room/js/config.js` kholo
2. Yeh change karo:

```js
const CONFIG = {
  USE_API: true,                    // false se true karo
  API_BASE: "http://127.0.0.1:8000"
};
```

3. `index.html` browser mein kholo
4. Ab data backend se aayega

### Step 5: API Key daalna (jab mil jaye)

1. `india-bihar-backend` folder mein `.env.example` ko copy karke `.env` banao
2. Andar likho:

```
DATA_GOV_API_KEY=yahan_apni_key_daalo
```

3. Phir main real fetch code activate kar dunga

---

## Files ka summary

| Folder | Kaam |
|--------|------|
| `india-dev-control-room/` | Frontend dashboard (website) |
| `india-bihar-backend/` | Backend API + database |
| `js/config.js` | API on/off switch |
| `app/jobs/fetch_mospi.py` | Automatic data lane ka future code |

---

## Next (main karunga jab tum ready ho)

1. Real MoSPI inflation fetch (API Key ke baad)
2. Frontend + Backend ko production pe host karna (Vercel + Railway)
3. Daily automatic update schedule
