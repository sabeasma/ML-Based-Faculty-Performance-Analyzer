const db = require('../config/db');

let courseFeedbackSchemaReady = false;

async function ensureCourseFeedbackSchema() {
  if (courseFeedbackSchemaReady) {
    return;
  }

  await db.query(
    `
    CREATE TABLE IF NOT EXISTS CourseFeedback (
      course_feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      course_id INT NOT NULL,
      rating_content TINYINT NOT NULL,
      rating_difficulty TINYINT NOT NULL,
      rating_resources TINYINT NOT NULL,
      rating_organization TINYINT NOT NULL,
      rating_overall TINYINT NOT NULL,
      comments VARCHAR(255),
      semester VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (course_id) REFERENCES Subjects(subject_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    `
  );

  await db.query(
    `
    CREATE TABLE IF NOT EXISTS Notifications (
      notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      role ENUM('admin', 'hod', 'faculty', 'student') NOT NULL,
      title VARCHAR(150) NOT NULL,
      message VARCHAR(255) NOT NULL,
      category ENUM('feedback', 'ml', 'ranking', 'system', 'report', 'research') DEFAULT 'system',
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP NULL,
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    `
  );

  courseFeedbackSchemaReady = true;
}

function asRating(value) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return null;
  }
  return num;
}

async function resolveStudentId(req, studentIdFromPayload) {
  if (req.user?.role === 'student') {
    const [[studentRow]] = await db.query(
      'SELECT student_id FROM Students WHERE user_id = ? LIMIT 1',
      [req.user.userId]
    );

    return studentRow?.student_id || null;
  }

  return Number(studentIdFromPayload) || null;
}

exports.submitCourseFeedback = async (req, res) => {
  try {
    await ensureCourseFeedbackSchema();

    const {
      studentId,
      student_id,
      courseId,
      course_id,
      ratingContent,
      rating_content,
      ratingDifficulty,
      rating_difficulty,
      ratingResources,
      rating_resources,
      ratingOrganization,
      rating_organization,
      ratingOverall,
      rating_overall,
      comments,
      semester,
    } = req.body;

    const resolvedStudentId = await resolveStudentId(req, studentId ?? student_id);
    const resolvedCourseId = Number(courseId ?? course_id) || null;
    const payload = {
      ratingContent: asRating(ratingContent ?? rating_content),
      ratingDifficulty: asRating(ratingDifficulty ?? rating_difficulty),
      ratingResources: asRating(ratingResources ?? rating_resources),
      ratingOrganization: asRating(ratingOrganization ?? rating_organization),
      ratingOverall: asRating(ratingOverall ?? rating_overall),
    };

    if (!resolvedStudentId || !resolvedCourseId) {
      return res.status(400).json({ message: 'student_id and course_id are required' });
    }

    if (Object.values(payload).some((value) => value === null)) {
      return res.status(400).json({ message: 'All ratings must be integers between 1 and 5' });
    }

    const [result] = await db.query(
      `
      INSERT INTO CourseFeedback (
        student_id,
        course_id,
        rating_content,
        rating_difficulty,
        rating_resources,
        rating_organization,
        rating_overall,
        comments,
        semester
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        resolvedStudentId,
        resolvedCourseId,
        payload.ratingContent,
        payload.ratingDifficulty,
        payload.ratingResources,
        payload.ratingOrganization,
        payload.ratingOverall,
        comments || null,
        semester || '2025_S1',
      ]
    );

    await db.query(
      `
      INSERT INTO Notifications (user_id, role, title, message, category)
      SELECT user_id, 'student', 'Course feedback submitted', 'Your course feedback was recorded successfully.', 'feedback'
      FROM Students
      WHERE student_id = ?
      LIMIT 1
      `,
      [resolvedStudentId]
    );

    return res.status(201).json({ message: 'Course feedback submitted', courseFeedbackId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Course feedback submission failed', error: error.message });
  }
};

exports.getCourseFeedback = async (req, res) => {
  try {
    await ensureCourseFeedbackSchema();

    let query = `
      SELECT
        cf.course_feedback_id,
        cf.course_id,
        s.code AS course_code,
        s.title AS course_title,
        cf.rating_content,
        cf.rating_difficulty,
        cf.rating_resources,
        cf.rating_organization,
        cf.rating_overall,
        cf.comments,
        cf.semester,
        cf.created_at,
        cf.student_id
      FROM CourseFeedback cf
      JOIN Subjects s ON s.subject_id = cf.course_id
    `;

    const values = [];
    if (req.user?.role === 'student') {
      query += ' WHERE cf.student_id = (SELECT student_id FROM Students WHERE user_id = ? LIMIT 1)';
      values.push(req.user.userId);
    } else if (req.user?.role === 'hod') {
      query += ' WHERE s.department_id = ?';
      values.push(req.user.departmentId);
    }

    query += ' ORDER BY cf.course_feedback_id DESC LIMIT 500';

    const [rows] = await db.query(query, values);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch course feedback', error: error.message });
  }
};
