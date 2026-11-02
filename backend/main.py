
import os
import uuid
from datetime import datetime, timezone
from contextlib import contextmanager
from typing import Literal

import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ==========================================
# 1. ENVIRONMENT CONFIGURATION
# ==========================================

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL missing. Set it in Render Environment Variables.")


# ==========================================
# 2. FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Digital Jan Samvad API",
    description="Citizen Complaint Management System",
    version="1.0.0"
)


# ==========================================
# 3. CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 4. DATABASE CONNECTION
# ==========================================

@contextmanager
def connect():
    con = None

    try:
        con = psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row,
            connect_timeout=15
        )
        yield con
        con.commit()

    except Exception:
        if con:
            con.rollback()
        raise

    finally:
        if con:
            con.close()


# ==========================================
# 5. DATABASE INITIALIZATION
# ==========================================

def init_db():
    with connect() as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS complaints (
                reference TEXT PRIMARY KEY,
                language TEXT NOT NULL,
                area TEXT NOT NULL,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)


@app.on_event("startup")
def startup_event():
    init_db()
    print("Database connected and initialized successfully!")


# ==========================================
# 6. REQUEST MODELS
# ==========================================

class Complaint(BaseModel):
    language: Literal["en", "hi", "pa"] = "en"

    area: str = Field(
        min_length=2,
        max_length=120
    )

    category: str = Field(
        min_length=2,
        max_length=80
    )

    title: str = Field(
        min_length=4,
        max_length=160
    )

    description: str = Field(
        min_length=10,
        max_length=3000
    )


class ChatMessage(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000
    )

    language: Literal["en", "hi", "pa"] = "en"


# ==========================================
# 7. HOME ROUTE
# ==========================================

@app.get("/")
def home():
    return {
        "service": "Digital Jan Samvad",
        "status": "running",
        "database": "Neon PostgreSQL"
    }


# ==========================================
# 8. HEALTH CHECK
# ==========================================

@app.get("/api/health")
def health():
    try:
        with connect() as con:
            con.execute("SELECT 1")

        return {
            "ok": True,
            "database": "connected"
        }

    except Exception as e:
        print("Database health error:", str(e))

        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )


# ==========================================
# 9. REGISTER COMPLAINT
# ==========================================

@app.post("/api/complaints", status_code=201)
def create_complaint(item: Complaint):

    reference = "DJS-" + uuid.uuid4().hex[:10].upper()

    created = datetime.now(
        timezone.utc
    ).isoformat()

    try:
        with connect() as con:

            con.execute("""
                INSERT INTO complaints
                (
                    reference,
                    language,
                    area,
                    category,
                    title,
                    description,
                    status,
                    created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                reference,
                item.language,
                item.area.strip(),
                item.category.strip(),
                item.title.strip(),
                item.description.strip(),
                "Received",
                created
            ))

        print("Complaint saved:", reference)

        return {
            "reference": reference,
            "language": item.language,
            "area": item.area,
            "category": item.category,
            "title": item.title,
            "status": "Received",
            "created_at": created,
            "message": "Complaint submitted successfully"
        }

    except Exception as e:
        print("Complaint INSERT ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to save complaint. Please try again."
        )


# ==========================================
# 10. TRACK COMPLAINT
# ==========================================

@app.get("/api/complaints/{reference}")
def track_complaint(reference: str):

    try:
        with connect() as con:

            row = con.execute("""
                SELECT
                    reference,
                    area,
                    category,
                    title,
                    status,
                    created_at
                FROM complaints
                WHERE reference = %s
            """, (
                reference.strip().upper(),
            )).fetchone()

        if row is None:
            raise HTTPException(
                status_code=404,
                detail="Complaint reference not found"
            )

        return row

    except HTTPException:
        raise

    except Exception as e:
        print("TRACK ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to track complaint"
        )


# ==========================================
# 11. PUBLIC DASHBOARD
# ==========================================

@app.get("/api/dashboard")
def dashboard():

    try:
        with connect() as con:

            total = con.execute("""
                SELECT COUNT(*) AS n
                FROM complaints
            """).fetchone()["n"]

            categories = con.execute("""
                SELECT
                    category,
                    COUNT(*) AS count
                FROM complaints
                GROUP BY category
                ORDER BY count DESC
            """).fetchall()

            statuses = con.execute("""
                SELECT
                    status,
                    COUNT(*) AS count
                FROM complaints
                GROUP BY status
                ORDER BY status
            """).fetchall()

        return {
            "total": total,
            "categories": categories,
            "statuses": statuses
        }

    except Exception as e:
        print("DASHBOARD ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Dashboard data unavailable"
        )


# ==========================================
# 12. MULTILINGUAL CHATBOT
# ==========================================

@app.post("/api/chat")
def chatbot(item: ChatMessage):

    msg = item.message.lower()

    if item.language == "hi":

        if any(x in msg for x in ["स्टेटस", "स्थिति", "ट्रैक"]):
            answer = "शिकायत ट्रैक पेज पर अपना रेफरेंस नंबर डालें।"

        elif any(x in msg for x in ["शिकायत", "दर्ज"]):
            answer = "शिकायत दर्ज करने के लिए Register Complaint पेज खोलें।"

        else:
            answer = "मैं शिकायत दर्ज करने और उसकी स्थिति देखने में आपकी मदद कर सकता हूँ।"

    elif item.language == "pa":

        if any(x in msg for x in ["ਸਟੇਟਸ", "ਸਥਿਤੀ", "ਟ੍ਰੈਕ"]):
            answer = "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਪੇਜ ਉੱਤੇ ਆਪਣਾ ਰੈਫਰੈਂਸ ਨੰਬਰ ਭਰੋ।"

        elif any(x in msg for x in ["ਸ਼ਿਕਾਇਤ", "ਦਰਜ"]):
            answer = "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਲਈ Register Complaint ਪੇਜ ਖੋਲ੍ਹੋ।"

        else:
            answer = "ਮੈਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਅਤੇ ਉਸਦੀ ਸਥਿਤੀ ਦੇਖਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।"

    else:

        if any(x in msg for x in ["status", "track", "reference"]):
            answer = "Open Track Complaint and enter your reference number."

        elif any(x in msg for x in ["complaint", "register", "submit"]):
            answer = "Open Register Complaint and fill in your complaint details."

        else:
            answer = "Welcome to Digital Jan Samvad. I can help you register or track a complaint."

    return {
        "reply": answer
    }


# ==========================================
# 13. RUN INFORMATION
# ==========================================

@app.get("/api")
def api_info():
    return {
        "message": "Digital Jan Samvad API is working",
        "docs": "/docs",
        "health": "/api/health"
    }
