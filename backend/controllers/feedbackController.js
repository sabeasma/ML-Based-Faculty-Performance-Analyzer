const db = require('../config/db');

let feedbackSchemaReady = false;

async function ensureFeedbackSchema() {
  if (feedbackSchemaReady) {
    return;
  }

  const [columnRows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'Feedback'
      AND column_name = 'course_difficulty'
    `
  );

  if (!Number(columnRows?.[0]?.total || 0)) {
    await db.query('ALTER TABLE Feedback ADD COLUMN course_difficulty TINYINT NULL');
  }

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

  feedbackSchemaReady = true;
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

exports.submitFeedback = async (req, res) => {
  try {
    await ensureFeedbackSchema();

    const {
      studentId,
      student_id,
      facultyId,
      faculty_id,
      subjectId,
      subject_id,
      ratingTeaching,
      rating_teaching,
      ratingKnowledge,
      rating_knowledge,
      ratingInteraction,
      rating_interaction,
      ratingCommunication,
      rating_communication,
      courseDifficulty,
      course_difficulty,
      comments,
      semester,
    } = req.body;

    const resolvedStudentId = await resolveStudentId(req, studentId ?? student_id);

    const normalized = {
      studentId: resolvedStudentId,
      facultyId: Number(facultyId ?? faculty_id) || null,
      subjectId: Number(subjectId ?? subject_id) || null,
      ratingTeaching: asRating(ratingTeaching ?? rating_teaching),
      ratingKnowledge: asRating(ratingKnowledge ?? rating_knowledge),
      ratingInteraction: asRating(ratingInteraction ?? rating_interaction),
      ratingCommunication: asRating(ratingCommunication ?? rating_communication),
      courseDifficulty: asRating(courseDifficulty ?? course_difficulty),
    };

    if (!normalized.studentId || !normalized.facultyId || !normalized.subjectId) {
      return res.status(400).json({ message: 'student_id, faculty_id and subject_id are required' });
    }

    if (
      normalized.ratingTeaching === null ||
      normalized.ratingKnowledge === null ||
      normalized.ratingInteraction === null ||
      normalized.ratingCommunication === null ||
      normalized.courseDifficulty === null
    ) {
      return res.status(400).json({ message: 'All ratings must be integers between 1 and 5' });
    }

    const [result] = await db.query(
      `
      INSERT INTO Feedback (
        student_id,
        faculty_id,
        subject_id,
        rating_teaching,
        rating_knowledge,
        rating_interaction,
        rating_communication,
        course_difficulty,
        comments,
        semester
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        normalized.studentId,
        normalized.facultyId,
        normalized.subjectId,
        normalized.ratingTeaching,
        normalized.ratingKnowledge,
        normalized.ratingInteraction,
        normalized.ratingCommunication,
        normalized.courseDifficulty,
        comments || null,
        semester || '2025_S1',
      ]
    );

    const [[facultyUser]] = await db.query(
      'SELECT user_id, department_id FROM Faculty WHERE faculty_id = ? LIMIT 1',
      [normalized.facultyId]
    );

    if (facultyUser) {
      await db.query(
        `
        INSERT INTO Notifications (user_id, role, title, message, category)
        VALUES (?, 'faculty', 'New student feedback received', 'A new feedback entry has been submitted for your classes.', 'feedback')
        `,
        [facultyUser.user_id]
      );

      const [hodRows] = await db.query(
        "SELECT user_id FROM Users WHERE role = 'hod' AND department_id = ?",
        [facultyUser.department_id]
      );

      if (hodRows.length > 0) {
        const hodValues = hodRows.map((hod) => [
          hod.user_id,
          'hod',
          'Department feedback update',
          'New feedback has been submitted in your department.',
          'feedback',
        ]);

        await db.query(
          'INSERT INTO Notifications (user_id, role, title, message, category) VALUES ?',
          [hodValues]
        );
      }
    }

    return res.status(201).json({ message: 'Feedback submitted', feedbackId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Feedback submission failed', error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    await ensureFeedbackSchema();

    let query = `
      SELECT fb.feedback_id, fb.semester, fb.comments, fb.created_at,
        fb.student_id,
        fb.course_difficulty,
        u.full_name AS faculty_name,
        fb.subject_id,
        s.code AS subject_code,
        s.title AS subject_title,
        (fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4 AS avg_rating
      FROM Feedback fb
      JOIN Faculty f ON f.faculty_id = fb.faculty_id
      JOIN Users u ON u.user_id = f.user_id
      JOIN Subjects s ON s.subject_id = fb.subject_id
    `;

    const values = [];
    if (req.user?.role === 'student') {
      query += ' WHERE fb.student_id = (SELECT student_id FROM Students WHERE user_id = ? LIMIT 1)';
      values.push(req.user.userId);
    } else if (req.user?.role === 'faculty') {
      query += ' WHERE fb.faculty_id = (SELECT faculty_id FROM Faculty WHERE user_id = ? LIMIT 1)';
      values.push(req.user.userId);
    } else if (req.user?.role === 'hod') {
      query += ' WHERE f.department_id = ?';
      values.push(req.user.departmentId);
    }

    query += ' ORDER BY fb.feedback_id DESC LIMIT 500';

    const [rows] = await db.query(query, values);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
  }
};
