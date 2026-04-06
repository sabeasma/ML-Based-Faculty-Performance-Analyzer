from fastapi import FastAPI
from pydantic import BaseModel, Field
from training.train_model import FEATURES, load_or_train_model, train_and_save_model

app = FastAPI(title="Faculty Performance ML Service", version="1.0.0")

model, model_metrics = load_or_train_model()


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
    model, model_metrics = train_and_save_model()
    return {"message": "Model retrained", "metrics": model_metrics}


@app.get("/model-metrics")
def metrics():
    return model_metrics
