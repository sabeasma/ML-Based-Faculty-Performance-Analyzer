const db = require('./db');

const facultyColumns = [
  { name: 'student_feedback_score', ddl: 'DECIMAL(5,2) DEFAULT 0' },
  { name: 'attendance_percentage', ddl: 'DECIMAL(5,2) DEFAULT 0' },
  { name: 'research_publications', ddl: 'INT DEFAULT 0' },
  { name: 'research_impact_score', ddl: 'DECIMAL(6,2) DEFAULT 0' },
  { name: 'ml_score', ddl: 'DECIMAL(5,2) DEFAULT 0' },
];

async function ensureFacultyColumns() {
  for (const column of facultyColumns) {
    const [rows] = await db.query(
      `
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Faculty'
        AND COLUMN_NAME = ?
      LIMIT 1
      `,
      [column.name]
    );

    if (!rows.length) {
      await db.query(`ALTER TABLE Faculty ADD COLUMN ${column.name} ${column.ddl}`);
    }
  }
}

async function runMigrations() {
  await ensureFacultyColumns();
}

module.exports = { runMigrations };
