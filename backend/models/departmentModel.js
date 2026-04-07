const db = require('../config/db');

async function getAllDepartments() {
  const [rows] = await db.query(
    `
    SELECT
      d.department_id AS id,
      d.name,
      d.hod_user_id AS hod,
      COUNT(f.faculty_id) AS facultyCount
    FROM Departments d
    LEFT JOIN Faculty f ON f.department_id = d.department_id
    GROUP BY d.department_id
    ORDER BY d.department_id DESC
    `
  );
  return rows;
}

async function createDepartment(payload) {
  const [result] = await db.query('INSERT INTO Departments (name, hod_user_id) VALUES (?, ?)', [
    payload.name,
    payload.hod || null,
  ]);

  return result.insertId;
}

async function updateDepartment(departmentId, payload) {
  const [result] = await db.query('UPDATE Departments SET name = ?, hod_user_id = ? WHERE department_id = ?', [
    payload.name,
    payload.hod || null,
    departmentId,
  ]);

  return result.affectedRows > 0;
}

async function deleteDepartment(departmentId) {
  const [result] = await db.query('DELETE FROM Departments WHERE department_id = ?', [departmentId]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
