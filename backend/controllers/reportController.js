const db = require('../config/db');
const PDFDocument = require('pdfkit');

let reportsTableReady = false;

async function ensureReportsTable() {
  if (reportsTableReady) {
    return;
  }

  await db.query(
    `
    CREATE TABLE IF NOT EXISTS Reports (
      report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
      generated_by INT NOT NULL,
      role ENUM('admin', 'hod') NOT NULL,
      report_type ENUM('faculty_performance', 'department_performance', 'research_analytics', 'feedback_analytics') NOT NULL,
      format ENUM('csv', 'pdf') DEFAULT 'csv',
      file_name VARCHAR(180) NOT NULL,
      generated_for_department INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (generated_by) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (generated_for_department) REFERENCES Departments(department_id)
        ON DELETE SET NULL ON UPDATE CASCADE
    )
    `
  );

  reportsTableReady = true;
}

function normalizeReportType(type) {
  const allowed = new Set([
    'faculty_performance',
    'department_performance',
    'research_analytics',
    'feedback_analytics',
  ]);

  return allowed.has(type) ? type : null;
}

function normalizeFormat(format) {
  return format === 'pdf' ? 'pdf' : 'csv';
}

function toCsv(rows) {
  if (!rows.length) {
    return 'message\nNo data available\n';
  }

  const columns = Object.keys(rows[0]);
  const escape = (value) => {
    const str = String(value ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const header = columns.join(',');
  const body = rows.map((row) => columns.map((column) => escape(row[column])).join(',')).join('\n');
  return `${header}\n${body}\n`;
}

function toPdfBuffer(rows, reportType) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).text('ML-Based Faculty Performance Analyzer', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Report Type: ${reportType}`);
    doc.text(`Generated At: ${new Date().toISOString()}`);
    doc.text(`Total Rows: ${rows.length}`);
    doc.moveDown();

    if (rows.length === 0) {
      doc.text('No data available');
      doc.end();
      return;
    }

    const columns = Object.keys(rows[0]);
    doc.fontSize(10).text(columns.join(' | '));
    doc.moveDown(0.5);

    rows.slice(0, 250).forEach((row) => {
      const line = columns.map((column) => String(row[column] ?? '')).join(' | ');
      doc.text(line, { lineBreak: true });
    });

    doc.end();
  });
}

async function buildReportContent(rows, reportType, format) {
  if (format === 'pdf') {
    const buffer = await toPdfBuffer(rows, reportType);
    return {
      content: buffer,
      mimeType: 'application/pdf',
      isBase64: false,
    };
  }

  return {
    content: Buffer.from(toCsv(rows), 'utf8'),
    mimeType: 'text/csv; charset=utf-8',
    isBase64: false,
  };
}

async function getReportRows(reportType, user) {
  if (reportType === 'faculty_performance') {
    const values = [];
    let whereClause = '';
    if (user.role === 'hod') {
      whereClause = 'WHERE f.department_id = ?';
      values.push(user.departmentId);
    }

    const [rows] = await db.query(
      `
      SELECT
        u.full_name AS faculty_name,
        d.name AS department,
        f.years_of_experience,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS feedback_score,
        ROUND(COALESCE(MAX(a.attendance_percentage), 0), 2) AS attendance_percentage,
        COALESCE(MAX(ms.score), 0) AS ml_score
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      LEFT JOIN Attendance a ON a.faculty_id = f.faculty_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      ${whereClause}
      GROUP BY f.faculty_id
      ORDER BY ml_score DESC
      LIMIT 500
      `,
      values
    );

    return rows;
  }

  if (reportType === 'department_performance') {
    const values = [];
    let whereClause = '';
    if (user.role === 'hod') {
      whereClause = 'WHERE d.department_id = ?';
      values.push(user.departmentId);
    }

    const [rows] = await db.query(
      `
      SELECT
        d.name AS department,
        COUNT(DISTINCT f.faculty_id) AS faculty_count,
        ROUND(AVG(ms.score), 2) AS average_ml_score,
        ROUND(AVG((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4), 2) AS average_feedback_score
      FROM Departments d
      LEFT JOIN Faculty f ON f.department_id = d.department_id
      LEFT JOIN MLScores ms ON ms.faculty_id = f.faculty_id AND ms.predicted_for_semester = '2025-ODD'
      LEFT JOIN Feedback fb ON fb.faculty_id = f.faculty_id
      ${whereClause}
      GROUP BY d.department_id
      ORDER BY average_ml_score DESC
      LIMIT 100
      `,
      values
    );

    return rows;
  }

  if (reportType === 'research_analytics') {
    const values = [];
    let whereClause = '';
    if (user.role === 'hod') {
      whereClause = 'WHERE f.department_id = ?';
      values.push(user.departmentId);
    }

    const [rows] = await db.query(
      `
      SELECT
        u.full_name AS faculty_name,
        d.name AS department,
        COUNT(r.publication_id) AS publications,
        COALESCE(SUM(r.citation_count), 0) AS citations,
        ROUND(AVG(r.impact_factor), 2) AS impact_score
      FROM Faculty f
      JOIN Users u ON u.user_id = f.user_id
      JOIN Departments d ON d.department_id = f.department_id
      LEFT JOIN ResearchPublications r ON r.faculty_id = f.faculty_id
      ${whereClause}
      GROUP BY f.faculty_id
      ORDER BY citations DESC
      LIMIT 500
      `,
      values
    );

    return rows;
  }

  const values = [];
  let whereClause = '';
  if (user.role === 'hod') {
    whereClause = 'WHERE f.department_id = ?';
    values.push(user.departmentId);
  }

  const [rows] = await db.query(
    `
    SELECT
      u.full_name AS faculty_name,
      d.name AS department,
      s.code AS subject_code,
      fb.semester,
      ROUND((fb.rating_teaching + fb.rating_knowledge + fb.rating_interaction + fb.rating_communication) / 4, 2) AS average_rating,
      fb.created_at
    FROM Feedback fb
    JOIN Faculty f ON f.faculty_id = fb.faculty_id
    JOIN Users u ON u.user_id = f.user_id
    JOIN Departments d ON d.department_id = f.department_id
    JOIN Subjects s ON s.subject_id = fb.subject_id
    ${whereClause}
    ORDER BY fb.created_at DESC
    LIMIT 1000
    `,
    values
  );

  return rows;
}

exports.getReports = async (req, res) => {
  try {
    await ensureReportsTable();

    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['admin', 'hod'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    const [rows] = await db.query(
      `
      SELECT
        report_id,
        role,
        report_type,
        format,
        file_name,
        generated_for_department,
        created_at
      FROM Reports
      WHERE generated_by = ?
      ORDER BY created_at DESC
      LIMIT 200
      `,
      [req.user.userId]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    await ensureReportsTable();

    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['admin', 'hod'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    const reportType = normalizeReportType(req.body.reportType || req.body.report_type);
    const format = normalizeFormat(req.body.format);

    if (!reportType) {
      return res.status(400).json({ message: 'Invalid reportType' });
    }

    const rows = await getReportRows(reportType, req.user);
    const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
    const fileName = `${reportType}_${timestamp}.${format}`;

    const [result] = await db.query(
      `
      INSERT INTO Reports (generated_by, role, report_type, format, file_name, generated_for_department)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [req.user.userId, req.user.role, reportType, format, fileName, req.user.role === 'hod' ? req.user.departmentId : null]
    );

    const shouldDownload = String(req.query.download || req.body.download || '').toLowerCase() === 'true';
    const payload = await buildReportContent(rows, reportType, format);

    if (shouldDownload) {
      res.setHeader('Content-Type', payload.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.send(payload.content);
    }

    return res.json({
      reportId: result.insertId,
      reportType,
      format,
      fileName,
      rowCount: rows.length,
      content: payload.content.toString('base64'),
      mimeType: payload.mimeType,
      isBase64: true,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    await ensureReportsTable();

    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['admin', 'hod'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    const reportId = Number(req.params.reportId);
    if (!Number.isInteger(reportId) || reportId <= 0) {
      return res.status(400).json({ message: 'Invalid reportId' });
    }

    const [[report]] = await db.query(
      `
      SELECT report_id, generated_by, report_type, format, file_name, generated_for_department
      FROM Reports
      WHERE report_id = ?
      LIMIT 1
      `,
      [reportId]
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const isOwner = Number(report.generated_by) === Number(req.user.userId);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: report access denied' });
    }

    const scope = {
      role: report.generated_for_department ? 'hod' : 'admin',
      departmentId: report.generated_for_department || null,
    };

    const rows = await getReportRows(report.report_type, scope);
    const payload = await buildReportContent(rows, report.report_type, report.format);

    res.setHeader('Content-Type', payload.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${report.file_name}"`);
    return res.send(payload.content);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to download report', error: error.message });
  }
};
