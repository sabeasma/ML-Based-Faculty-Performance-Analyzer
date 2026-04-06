from datetime import datetime, timezone
import os
import threading
import time

from fastapi import FastAPI
from pydantic import BaseModel, Field
from training.train_model import FEATURES, load_or_train_model, train_and_save_model

app = FastAPI(title="Faculty Performance ML Service", version="1.0.0")

model, model_metrics = load_or_train_model()
model_lock = threading.Lock()

auto_retrain_enabled = os.getenv("AUTO_RETRAIN_ENABLED", "true").lower() in {"1", "true", "yes", "on"}
auto_retrain_interval_minutes = max(1, int(os.getenv("AUTO_RETRAIN_INTERVAL_MINUTES", "360")))
retrain_state = {
    "last_retrained_at": datetime.now(timezone.utc).isoformat(),
    "last_error": None,
    "runs": 0,
}


class FacultyFeatures(BaseModel):
    student_feedback_score: float = Field(..., ge=0, le=5)
    attendance_percentage: float = Field(..., ge=0, le=100)
    research_publications: int = Field(..., ge=0)
    research_citations: int = Field(..., ge=0)
    years_of_experience: int = Field(..., ge=0)
    subjects_handled: int = Field(..., ge=0)
    course_difficulty_score: float = Field(..., ge=0, le=10)


@app.get("/")
def health():
    return {"status": "ok", "service": "ml-service"}


@app.post("/predict")
def predict(payload: FacultyFeatures):
    ordered = [getattr(payload, feature) for feature in FEATURES]
    with model_lock:
        score = float(model.predict([ordered])[0])
    score = max(0.0, min(100.0, score))
    rounded_score = round(score, 2)

    return {
        "ml_score": rounded_score,
        "predicted_score": rounded_score,
        "risk_level": "high" if score < 60 else ("medium" if score < 80 else "low"),
        "promotion_eligible": score >= 85,
    }


@app.post("/train")
def train():
    global model, model_metrics
    trained_model, trained_metrics = train_and_save_model()
    with model_lock:
        model = trained_model
        model_metrics = trained_metrics

    retrain_state["last_retrained_at"] = datetime.now(timezone.utc).isoformat()
    retrain_state["last_error"] = None
    retrain_state["runs"] += 1
    return {"message": "Model retrained", "metrics": model_metrics}


@app.get("/model-metrics")
def metrics():
    return model_metrics


@app.get("/retrain-status")
def retrain_status():
    return {
        "auto_retrain_enabled": auto_retrain_enabled,
        "auto_retrain_interval_minutes": auto_retrain_interval_minutes,
        "last_retrained_at": retrain_state["last_retrained_at"],
        "last_error": retrain_state["last_error"],
        "runs": retrain_state["runs"],
    }


def auto_retrain_loop():
    global model, model_metrics
    while True:
        time.sleep(auto_retrain_interval_minutes * 60)
        try:
            trained_model, trained_metrics = train_and_save_model()
            with model_lock:
                model = trained_model
                model_metrics = trained_metrics
            retrain_state["last_retrained_at"] = datetime.now(timezone.utc).isoformat()
            retrain_state["last_error"] = None
            retrain_state["runs"] += 1
        except Exception as exc:  # pragma: no cover
            retrain_state["last_error"] = str(exc)


@app.on_event("startup")
def startup_event():
    if auto_retrain_enabled:
        thread = threading.Thread(target=auto_retrain_loop, daemon=True)
        thread.start()
