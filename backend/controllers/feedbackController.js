const db = require('../config/db');

exports.submitFeedback = async (req, res) => {
  try {
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
      comments,
      semester,
    } = req.body;

    const normalized = {
      studentId: studentId ?? student_id,
      facultyId: facultyId ?? faculty_id,
      subjectId: subjectId ?? subject_id,
      ratingTeaching: ratingTeaching ?? rating_teaching,
      ratingKnowledge: ratingKnowledge ?? rating_knowledge,
      ratingInteraction: ratingInteraction ?? rating_interaction,
      ratingCommunication: ratingCommunication ?? rating_communication,
    };

    if (!normalized.studentId || !normalized.facultyId || !normalized.subjectId) {
      return res.status(400).json({ message: 'student_id, faculty_id and subject_id are required' });
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
        comments,
        semester
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        normalized.studentId,
        normalized.facultyId,
        normalized.subjectId,
        normalized.ratingTeaching,
        normalized.ratingKnowledge,
        normalized.ratingInteraction,
        normalized.ratingCommunication,
        comments || null,
        semester || '2025-ODD',
      ]
    );

    return res.status(201).json({ message: 'Feedback submitted', feedbackId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Feedback submission failed', error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const query = `
      SELECT fb.feedback_id, fb.semester, fb.comments, fb.created_at,
        u.full_name AS faculty_name,
        s.code AS subject_code,
        (fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4 AS avg_rating
      FROM Feedback fb
      JOIN Faculty f ON f.faculty_id = fb.faculty_id
      JOIN Users u ON u.user_id = f.user_id
      JOIN Subjects s ON s.subject_id = fb.subject_id
      ORDER BY fb.feedback_id DESC
      LIMIT 300
    `;

    const [rows] = await db.query(query);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
  }
};
