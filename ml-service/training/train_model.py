from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

MODEL_PATH = Path(__file__).resolve().parents[1] / "model" / "xgb_faculty_model.joblib"
METRICS_PATH = Path(__file__).resolve().parents[1] / "model" / "metrics.joblib"

FEATURES = [
    "student_feedback_score",
    "attendance_percentage",
    "research_publications",
    "research_citations",
    "years_of_experience",
    "subjects_handled",
    "course_difficulty_score",
]


def generate_synthetic_dataset(n_rows: int = 2500, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    feedback = rng.uniform(2.0, 5.0, n_rows)
    attendance = rng.uniform(65, 100, n_rows)
    papers = rng.integers(0, 30, n_rows)
    citations = rng.integers(0, 500, n_rows)
    experience = rng.integers(1, 30, n_rows)
    subjects = rng.integers(1, 8, n_rows)
    difficulty = rng.uniform(1.5, 5.0, n_rows)

    raw_score = (
        (feedback * 15)
        + (attendance * 0.35)
        + (papers * 1.8)
        + (citations * 0.06)
        + (experience * 0.9)
        + (subjects * 0.8)
        - (difficulty * 1.4)
        + rng.normal(0, 4, n_rows)
    )

    score = np.clip(raw_score, 0, 100)

    return pd.DataFrame(
        {
            "student_feedback_score": feedback,
            "attendance_percentage": attendance,
            "research_publications": papers,
            "research_citations": citations,
            "years_of_experience": experience,
            "subjects_handled": subjects,
            "course_difficulty_score": difficulty,
            "performance_score": score,
        }
    )


def train_and_save_model(dataset: pd.DataFrame | None = None):
    data = dataset if dataset is not None else generate_synthetic_dataset()
    X = data[FEATURES]
    y = data["performance_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(
        n_estimators=260,
        max_depth=6,
        learning_rate=0.07,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="reg:squarederror",
        random_state=42,
    )

    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    metrics = {
        "mae": float(mean_absolute_error(y_test, preds)),
        "r2": float(r2_score(y_test, preds)),
        "samples": int(len(data)),
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(metrics, METRICS_PATH)

    return model, metrics


def load_or_train_model():
    if MODEL_PATH.exists() and METRICS_PATH.exists():
        return joblib.load(MODEL_PATH), joblib.load(METRICS_PATH)
    return train_and_save_model()
