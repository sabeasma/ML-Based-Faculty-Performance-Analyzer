const db = require('../config/db');
const { predictScore, getModelMetrics } = require('../services/mlClient');

async function getFacultyFeatures(facultyId) {
  const [rows] = await db.query(
    `
    SELECT
      f.faculty_id,
      ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback_score,
      ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
      COUNT(r.publication_id) AS research_publications,
      COALESCE(SUM(r.citation_count), 0) AS research_citations,
      f.years_of_experience,
      f.subjects_handled,
      f.course_difficulty_score
    FROM Faculty f
    LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
    LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
    LEFT JOIN ResearchPublications r ON r.faculty_id = f.faculty_id
    WHERE f.faculty_id = ?
    GROUP BY f.faculty_id
    LIMIT 1
    `,
    [facultyId]
  );

  return rows[0] || null;
}

exports.predictFacultyScore = async (req, res) => {
  try {
    const { facultyId, faculty_id, semester } = req.body;
    const targetFacultyId = facultyId ?? faculty_id;
    if (!targetFacultyId) {
      return res.status(400).json({ message: 'facultyId is required' });
    }

    const features = await getFacultyFeatures(targetFacultyId);
    if (!features) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const payload = {
      student_feedback_score: Number(features.student_feedback_score || 0),
      attendance_percentage: Number(features.attendance_percentage || 0),
      research_publications: Number(features.research_publications || 0),
      research_citations: Number(features.research_citations || 0),
      years_of_experience: Number(features.years_of_experience || 0),
      subjects_handled: Number(features.subjects_handled || 0),
      course_difficulty_score: Number(features.course_difficulty_score || 0),
    };

    const prediction = await predictScore(payload);
    const mlScore = Number(prediction.ml_score ?? prediction.predicted_score ?? 0);
    const term = semester || '2025-ODD';

    await db.query(
      `
      INSERT INTO MLScores (faculty_id, score, risk_level, promotion_eligible, model_version, predicted_for_semester)
      VALUES (?, ?, ?, ?, 'xgb-v1', ?)
      ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        risk_level = VALUES(risk_level),
        promotion_eligible = VALUES(promotion_eligible),
        created_at = CURRENT_TIMESTAMP
      `,
      [
        targetFacultyId,
        mlScore,
        prediction.risk_level,
        prediction.promotion_eligible ? 1 : 0,
        term,
      ]
    );

    return res.json({
      faculty_id: targetFacultyId,
      semester: term,
      payload,
      prediction: {
        ...prediction,
        ml_score: mlScore,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Prediction failed', error: error.message });
  }
};

exports.getFacultyRankings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        ROW_NUMBER() OVER (ORDER BY ms.score DESC) AS ranking,
        f.faculty_id,
        u.full_name AS faculty_name,
        d.name AS department,
        f.years_of_experience,
        ms.score AS ml_score,
        ms.risk_level,
        ms.promotion_eligible
      FROM MLScores ms
      JOIN Faculty f ON f.faculty_id = ms.faculty_id
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
      WHERE ms.predicted_for_semester = '2025-ODD'
      ORDER BY ms.score DESC
      LIMIT 100
      `
    );

    return res.json(rows.map((row) => ({ ...row, rank: row.ranking })));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch rankings', error: error.message });
  }
};

exports.getModelMetrics = async (_req, res) => {
  try {
    const metrics = await getModelMetrics();
    return res.json(metrics);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch model metrics', error: error.message });
  }
};
