from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.database.database import (
    init_db,
    get_health_summary,
    get_medications,
    get_dose_log,
    get_metrics,
)

from backend.analytics import get_health_analytics
from backend.insights import generate_health_insights
from backend.agent import ask_health_assistant


app = FastAPI(
    title="Smart Health Assistant API",
    description="Backend API for the Track B Smart Health Assistant",
    version="1.0.0"
)


# ---------------- SECURITY ----------------

# Only allow our local React frontend
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ---------------- DATABASE ----------------

init_db()


# ---------------- REQUEST MODEL ----------------

class QuestionRequest(BaseModel):
    question: str = Field(
        min_length=1,
        max_length=500
    )


# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Smart Health Assistant API is running"
    }


# ---------------- HEALTH CHECK ----------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ---------------- HEALTH SUMMARY ----------------

@app.get("/health/summary")
def health_summary():
    return get_health_summary()


# ---------------- MEDICATIONS ----------------

@app.get("/medications")
def medications():
    return get_medications(active_only=True)


# ---------------- DOSE HISTORY ----------------

@app.get("/dose-history")
def dose_history():
    return get_dose_log()


# ---------------- HEALTH METRICS ----------------

@app.get("/health-metrics")
def health_metrics():
    return get_metrics()


# ---------------- ANALYTICS ----------------

@app.get("/analytics")
def analytics():
    return get_health_analytics()


# ---------------- INSIGHTS ----------------

@app.get("/insights")
def health_insights():
    return generate_health_insights()


# ---------------- AI HEALTH ASSISTANT ----------------

@app.post("/ask")
def ask_question(request: QuestionRequest):

    answer = ask_health_assistant(request.question)

    return {
        "question": request.question,
        "answer": answer
    }