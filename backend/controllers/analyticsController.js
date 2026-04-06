const db = require('../config/db');

exports.adminOverview = async (_req, res) => {
  try {
    const [[totals]] = await db.query(
      `
      SELECT
        (SELECT COUNT(*) FROM Faculty) AS total_faculty,
        (SELECT ROUND(AVG(score), 2) FROM MLScores WHERE predicted_for_semester = '2025-ODD') AS average_performance,
        (SELECT COUNT(*) FROM Departments) AS departments_covered,
        (SELECT u.full_name
          FROM MLScores m
          JOIN Faculty f ON f.faculty_id = m.faculty_id
          JOIN Users u ON u.user_id = f.user_id
          WHERE m.predicted_for_semester = '2025-ODD'
          ORDER BY m.score DESC LIMIT 1) AS top_ranked_faculty
      `
    );

    return res.json(totals);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch overview', error: error.message });
  }
};

exports.hodOverview = async (req, res) => {
  try {
    const depId = req.user.departmentId;
    const [[summary]] = await db.query(
      `
      SELECT
        COUNT(DISTINCT f.faculty_id) AS faculty_count,
        ROUND(AVG(ms.score), 2) AS department_average_score,
        COALESCE(SUM(r.citation_count), 0) AS research_output
      FROM Faculty f
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      LEFT JOIN ResearchPublications r ON r.faculty_id = f.faculty_id
      WHERE f.department_id = ?
      `,
      [depId]
    );

    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch HOD overview', error: error.message });
  }
};

exports.facultyOverview = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const [[row]] = await db.query(
      `
      SELECT
        f.faculty_id,
        u.full_name,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COUNT(r.publication_id) AS research_publications,
        COALESCE(MAX(ms.score), 0) AS ml_score
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
      LEFT JOIN ResearchPublications r ON r.faculty_id = f.faculty_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      WHERE f.faculty_id = ?
      GROUP BY f.faculty_id
      `,
      [facultyId]
    );

    if (!row) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    return res.json(row);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch faculty overview', error: error.message });
  }
};

exports.facultyDashboard = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [[row]] = await db.query(
      `
      SELECT
        f.faculty_id,
        u.full_name,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COUNT(r.publication_id) AS research_publications,
        COALESCE(MAX(ms.score), 0) AS ml_score
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
      LEFT JOIN ResearchPublications r ON r.faculty_id = f.faculty_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      WHERE f.user_id = ?
      GROUP BY f.faculty_id
      LIMIT 1
      `,
      [req.user.userId]
    );

    if (!row) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    return res.json(row);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch faculty dashboard', error: error.message });
  }
};

exports.studentOverview = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [[studentRow]] = await db.query(
      'SELECT student_id FROM Students WHERE user_id = ? LIMIT 1',
      [req.user.userId]
    );

    if (!studentRow) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const [[summary]] = await db.query(
      `
      SELECT
        COUNT(DISTINCT fb.subject_id) AS feedback_submitted,
        COUNT(DISTINCT fb.faculty_id) AS faculty_reviewed
      FROM Feedback fb
      WHERE fb.student_id = ?
      `,
      [studentRow.student_id]
    );

    return res.json({
      courses_enrolled: 6,
      feedback_pending: Math.max(0, 6 - Number(summary.feedback_submitted || 0)),
      feedback_submitted: Number(summary.feedback_submitted || 0),
      faculty_reviewed: Number(summary.faculty_reviewed || 0),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch student dashboard', error: error.message });
  }
};
