const db = require('../config/db');

exports.getAllFaculty = async (req, res) => {
  try {
    let query = `
      SELECT
        f.faculty_id,
        u.full_name,
        u.email,
        d.name AS department,
        f.qualification,
        f.years_of_experience,
        f.subjects_handled,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback_score,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COALESCE(MAX(ms.score), 0) AS ml_score,
        MAX(ms.risk_level) AS risk_level,
        MAX(ms.promotion_eligible) AS promotion_eligible
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
    `;

    const values = [];
    if (req.user.role === 'hod') {
      query += ' WHERE f.department_id = ? ';
      values.push(req.user.departmentId);
    }

    query += ' GROUP BY f.faculty_id ORDER BY ml_score DESC, u.full_name ASC';
    const [rows] = await db.query(query, values);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch faculty', error: error.message });
  }
};

exports.getFacultyByDepartment = async (req, res) => {
  try {
    const departmentId = Number(req.params.id);
    if (!departmentId) {
      return res.status(400).json({ message: 'Valid department id is required' });
    }

    if (req.user.role === 'hod' && Number(req.user.departmentId) !== departmentId) {
      return res.status(403).json({ message: 'Forbidden: you can only access your own department' });
    }

    const [rows] = await db.query(
      `
      SELECT
        f.faculty_id,
        u.full_name,
        u.email,
        d.name AS department,
        f.qualification,
        f.years_of_experience,
        f.subjects_handled,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback_score,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COALESCE(MAX(ms.score), 0) AS ml_score,
        MAX(ms.risk_level) AS risk_level,
        MAX(ms.promotion_eligible) AS promotion_eligible
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      WHERE f.department_id = ?
      GROUP BY f.faculty_id
      ORDER BY ml_score DESC, u.full_name ASC
      `,
      [departmentId]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch department faculty', error: error.message });
  }
};

exports.getMyPerformance = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [rows] = await db.query(
      `
      SELECT
        f.faculty_id,
        u.full_name,
        u.email,
        d.name AS department,
        f.qualification,
        f.years_of_experience,
        f.subjects_handled,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback_score,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COALESCE(COUNT(r.publication_id), 0) AS research_publications,
        COALESCE(SUM(r.citation_count), 0) AS research_citations,
        COALESCE(MAX(ms.score), 0) AS ml_score,
        MAX(ms.risk_level) AS risk_level,
        MAX(ms.promotion_eligible) AS promotion_eligible
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
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

    if (!rows.length) {
      return res.status(404).json({ message: 'Faculty profile not found for this user' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch personal performance', error: error.message });
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `
      SELECT
        f.faculty_id,
        u.full_name,
        u.email,
        d.name AS department,
        f.qualification,
        f.years_of_experience,
        f.subjects_handled,
        f.course_difficulty_score,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS student_feedback_score,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COALESCE(SUM(r.citation_count), 0) AS research_citations,
        COUNT(r.publication_id) AS research_publications,
        COALESCE(MAX(ms.score), 0) AS ml_score,
        MAX(ms.risk_level) AS risk_level,
        MAX(ms.promotion_eligible) AS promotion_eligible
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
      LEFT JOIN ResearchPublications r ON r.faculty_id = f.faculty_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      WHERE f.faculty_id = ?
      GROUP BY f.faculty_id
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch faculty', error: error.message });
  }
};

exports.createFaculty = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const {
      fullName,
      email,
      password,
      departmentId,
      qualification,
      yearsOfExperience,
      subjectsHandled,
      courseDifficultyScore,
    } = req.body;

    await conn.beginTransaction();
    const [userResult] = await conn.query(
      'INSERT INTO Users (full_name, email, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, password || 'faculty123', 'faculty', departmentId]
    );

    const [facultyResult] = await conn.query(
      `
      INSERT INTO Faculty
      (user_id, department_id, qualification, years_of_experience, subjects_handled, course_difficulty_score, joined_at)
      VALUES (?, ?, ?, ?, ?, ?, CURDATE())
      `,
      [
        userResult.insertId,
        departmentId,
        qualification || 'M.Tech',
        yearsOfExperience || 1,
        subjectsHandled || 2,
        courseDifficultyScore || 3,
      ]
    );

    await conn.commit();
    return res.status(201).json({
      message: 'Faculty created successfully',
      facultyId: facultyResult.insertId,
      userId: userResult.insertId,
    });
  } catch (error) {
    await conn.rollback();
    return res.status(500).json({ message: 'Failed to create faculty', error: error.message });
  } finally {
    conn.release();
  }
};
