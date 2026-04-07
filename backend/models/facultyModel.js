const db = require('../config/db');

async function getAllFaculty() {
  const [rows] = await db.query(
    `
    SELECT
      f.faculty_id,
      u.full_name AS name,
      u.email,
      f.department_id,
      d.name AS department,
      f.qualification,
      f.years_of_experience AS experience,
      f.subjects_handled AS subjectsHandled,
      COALESCE(f.student_feedback_score, 0) AS studentFeedbackScore,
      COALESCE(f.attendance_percentage, 0) AS attendancePercentage,
      COALESCE(f.research_publications, 0) AS researchPublications,
      COALESCE(f.research_impact_score, 0) AS researchImpactScore,
      COALESCE(f.ml_score, 0) AS mlScore,
      f.user_id
    FROM Faculty f
    JOIN Users u ON u.user_id = f.user_id
    JOIN Departments d ON d.department_id = f.department_id
    ORDER BY f.faculty_id DESC
    `
  );
  return rows;
}

async function getFacultyById(facultyId) {
  const [rows] = await db.query(
    `
    SELECT
      f.faculty_id,
      u.full_name AS name,
      u.email,
      f.department_id,
      d.name AS department,
      f.qualification,
      f.years_of_experience AS experience,
      f.subjects_handled AS subjectsHandled,
      COALESCE(f.student_feedback_score, 0) AS studentFeedbackScore,
      COALESCE(f.attendance_percentage, 0) AS attendancePercentage,
      COALESCE(f.research_publications, 0) AS researchPublications,
      COALESCE(f.research_impact_score, 0) AS researchImpactScore,
      COALESCE(f.ml_score, 0) AS mlScore,
      f.user_id
    FROM Faculty f
    JOIN Users u ON u.user_id = f.user_id
    JOIN Departments d ON d.department_id = f.department_id
    WHERE f.faculty_id = ?
    LIMIT 1
    `,
    [facultyId]
  );

  return rows[0] || null;
}

async function createFaculty(payload) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [userResult] = await conn.query(
      'INSERT INTO Users (full_name, email, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?)',
      [payload.name, payload.email, payload.password, 'faculty', payload.departmentId]
    );

    const [facultyResult] = await conn.query(
      `
      INSERT INTO Faculty (
        user_id,
        department_id,
        qualification,
        years_of_experience,
        subjects_handled,
        student_feedback_score,
        attendance_percentage,
        research_publications,
        research_impact_score,
        ml_score,
        joined_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
      `,
      [
        userResult.insertId,
        payload.departmentId,
        payload.qualification,
        payload.experience,
        payload.subjectsHandled,
        payload.studentFeedbackScore,
        payload.attendancePercentage,
        payload.researchPublications,
        payload.researchImpactScore,
        payload.mlScore,
      ]
    );

    await conn.commit();
    return { facultyId: facultyResult.insertId, userId: userResult.insertId };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function updateFaculty(facultyId, payload) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existingRows] = await conn.query('SELECT user_id FROM Faculty WHERE faculty_id = ? LIMIT 1', [facultyId]);
    if (!existingRows.length) {
      await conn.rollback();
      return null;
    }

    const userId = existingRows[0].user_id;

    await conn.query(
      'UPDATE Users SET full_name = ?, email = ?, department_id = ? WHERE user_id = ?',
      [payload.name, payload.email, payload.departmentId, userId]
    );

    await conn.query(
      `
      UPDATE Faculty
      SET
        department_id = ?,
        qualification = ?,
        years_of_experience = ?,
        subjects_handled = ?,
        student_feedback_score = ?,
        attendance_percentage = ?,
        research_publications = ?,
        research_impact_score = ?,
        ml_score = ?
      WHERE faculty_id = ?
      `,
      [
        payload.departmentId,
        payload.qualification,
        payload.experience,
        payload.subjectsHandled,
        payload.studentFeedbackScore,
        payload.attendancePercentage,
        payload.researchPublications,
        payload.researchImpactScore,
        payload.mlScore,
        facultyId,
      ]
    );

    await conn.commit();
    return { facultyId, userId };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function deleteFaculty(facultyId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query('SELECT user_id FROM Faculty WHERE faculty_id = ? LIMIT 1', [facultyId]);
    if (!rows.length) {
      await conn.rollback();
      return false;
    }

    const userId = rows[0].user_id;
    await conn.query('DELETE FROM Users WHERE user_id = ?', [userId]);

    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
