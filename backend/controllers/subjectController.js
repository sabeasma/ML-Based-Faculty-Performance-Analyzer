const db = require('../config/db');

exports.getSubjects = async (req, res) => {
  try {
    const facultyId = Number(req.query.facultyId || req.query.faculty_id);

    const [rows] = await db.query(
      `
      SELECT
        s.subject_id,
        s.code,
        s.title,
        s.department_id,
        d.name AS department
      FROM Subjects s
      JOIN Departments d ON d.department_id = s.department_id
      ${Number.isInteger(facultyId) && facultyId > 0 ? 'WHERE s.department_id = (SELECT department_id FROM Faculty WHERE faculty_id = ? LIMIT 1)' : ''}
      ORDER BY s.title ASC
      LIMIT 500
      `,
      Number.isInteger(facultyId) && facultyId > 0 ? [facultyId] : []
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};
