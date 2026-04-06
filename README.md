# ML-Based Faculty Performance Analyzer

A Dockerized full-stack AI academic analytics platform that evaluates faculty performance using student feedback, attendance, research output, and experience, then predicts an ML-based performance score using XGBoost.

## Stack

- Frontend: React + TailwindCSS + Recharts
- Backend: Node.js + Express + JWT
- ML Service: Python FastAPI + XGBoost
- Database: MySQL 8
- Orchestration: Docker Compose

## Services

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- ML Service: http://localhost:8000
- MySQL: localhost:3306

## Architecture

Students submit feedback -> MySQL -> Node.js backend APIs -> FastAPI ML model service -> predicted score -> React dashboards and rankings.

## Folder Structure

```text
ml-faculty-analyzer/
  frontend/
    src/
      components/
      pages/
      dashboard/
      charts/
      layout/
      services/
      context/
      utils/
      hooks/
  backend/
    controllers/
    routes/
    models/
    middleware/
    services/
    config/
    app.js
  ml-service/
    model/
    training/
    prediction_api/
    dataset/
    app.py
  database/
    schema.sql
    seed_data.sql
  docker/
    Dockerfile.frontend
    Dockerfile.backend
    Dockerfile.ml
    docker-compose.yml
  docker-compose.yml
  README.md
```

## Auth and Roles

JWT role-based auth with 4 roles:

- admin
- hod
- faculty
- student

Login response format:

```json
{
  "token": "...",
  "role": "admin",
  "userData": {
    "userId": 1,
    "fullName": "System Admin",
    "email": "admin@college.edu",
    "departmentId": 1
  }
}
```

Demo credentials:

- Admin: admin@college.edu / admin123
- HOD: hod1@college.edu / hod123
- Faculty: faculty1@college.edu / faculty123
- Student: student1@college.edu / student123

## Core API Endpoints

### Auth

- POST /api/auth/login
- POST /api/auth/register
- POST /api/login
- POST /api/register

### Faculty

- GET /api/faculty
- GET /api/faculty/:id
- POST /api/faculty

### Feedback

- POST /api/feedback
- GET /api/feedback

### ML and Rankings

- POST /api/ml/predict-score
- GET /api/ml/faculty-rankings
- GET /api/ml/model-metrics
- POST /api/predict-score
- GET /api/faculty-rankings

### Dashboard

- GET /api/dashboard/admin
- GET /api/dashboard/hod
- GET /api/dashboard/faculty
- GET /api/dashboard/student

### Notifications

- GET /api/notifications
- POST /api/notifications/read

### Reports

- GET /api/reports
- POST /api/reports/generate

### FastAPI ML service

- POST /predict
- POST /train
- GET /model-metrics

## ML Inputs and Output

Model: XGBoost regression

Features:

- student_feedback_score
- attendance_percentage
- research_publications
- research_citations
- years_of_experience
- subjects_handled
- course_difficulty_score

Output:

- Predicted performance score between 0 and 100

## Dataset Seeding

Database seed creates:

- 100 faculty records
- 1000 students
- 5000 feedback records
- attendance, publications, and baseline ML scores

## Run

From project root:

```bash
docker compose up --build
```

Using the docker folder layout:

```bash
docker compose -f docker/docker-compose.yml up --build
```

## Suggested Demo Flow

1. Login as admin.
2. Open leaderboard and analytics charts.
3. Login as HOD and compare department metrics.
4. Login as faculty to view personal analytics and recommendations.
5. Login as student and submit feedback.

## Notes

- Backend calls ML microservice over REST at `ML_SERVICE_URL`.
- Frontend uses a premium glassmorphism-inspired dashboard layout with dark mode toggle and responsive design.
