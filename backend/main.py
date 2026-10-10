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
from backend.agent import run_agent


app = FastAPI(
    title="Smart Health Assistant API",
    description="Backend API for the Track B Smart Health Assistant",
    version="1.0.0"
)


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# Initialize database
init_db()


class QuestionRequest(BaseModel):
    question: str = Field(
        min_length=1,
        max_length=500
    )


@app.get("/")
def home():
    return {
        "message": "Smart Health Assistant API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/health/summary")
def health_summary():
    return get_health_summary()


@app.get("/medications")
def medications():
    return get_medications(
        active_only=True
    )


@app.get("/dose-history")
def dose_history():
    return get_dose_log()


@app.get("/health-metrics")
def health_metrics():
    return get_metrics()


@app.get("/analytics")
def analytics():
    return get_health_analytics()


@app.get("/insights")
def health_insights():
    return generate_health_insights()


@app.post("/ask")
def ask_question(request: QuestionRequest):

    answer = run_agent(
        request.question
    )

    return {
        "question": request.question,
        "answer": answer
    }