const db = require('../config/db');
const { predictScore, getModelMetrics, triggerRetrain, getRetrainStatus } = require('../services/mlClient');

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

    const [[facultyUser]] = await db.query(
      'SELECT user_id, department_id FROM Faculty WHERE faculty_id = ? LIMIT 1',
      [targetFacultyId]
    );

    if (facultyUser) {
      await db.query(
        `
        INSERT INTO Notifications (user_id, role, title, message, category)
        VALUES (?, 'faculty', 'ML score updated', ?, 'ml')
        `,
        [
          facultyUser.user_id,
          `Your latest ML score is ${mlScore.toFixed(2)} for ${term}.`,
        ]
      );
    }

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
    const rawPage = Number.parseInt(req.query.page, 10);
    const rawPageSize = Number.parseInt(req.query.pageSize ?? req.query.page_size, 10);
    const semester = String(req.query.semester || '2025-ODD');

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const pageSize = Number.isInteger(rawPageSize) && rawPageSize > 0 ? Math.min(rawPageSize, 50) : 10;
    const offset = (page - 1) * pageSize;

    const [[countRow]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM MLScores
      WHERE predicted_for_semester = ?
      `,
      [semester]
    );

    const total = Number(countRow?.total || 0);

    const [rows] = await db.query(
      `
      WITH ranked AS (
        SELECT
          ROW_NUMBER() OVER (ORDER BY ms.score DESC, f.faculty_id ASC) AS ranking,
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
        WHERE ms.predicted_for_semester = ?
      )
      SELECT *
      FROM ranked
      ORDER BY ranking ASC
      LIMIT ? OFFSET ?
      `,
      [semester, pageSize, offset]
    );

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return res.json({
      items: rows.map((row) => ({ ...row, rank: row.ranking })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
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

exports.retrainModel = async (_req, res) => {
  try {
    const result = await triggerRetrain();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrain model', error: error.message });
  }
};

exports.getModelRetrainStatus = async (_req, res) => {
  try {
    const status = await getRetrainStatus();
    return res.json(status);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch retrain status', error: error.message });
  }
};
