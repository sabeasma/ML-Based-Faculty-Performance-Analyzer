const db = require('../config/db');

async function getAllUsers() {
  const [rows] = await db.query(
    `
    SELECT
      u.user_id AS id,
      u.full_name AS name,
      u.email,
      UPPER(u.role) AS role,
      u.department_id,
      d.name AS department,
      u.is_active AS isActive
    FROM Users u
    LEFT JOIN Departments d ON d.department_id = u.department_id
    ORDER BY u.user_id DESC
    `
  );

  return rows;
}

async function createUser(payload) {
  const [result] = await db.query(
    'INSERT INTO Users (full_name, email, password_hash, role, department_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [payload.name, payload.email, payload.password, payload.role.toLowerCase(), payload.departmentId || null, 1]
  );

  return result.insertId;
}

async function updateUser(userId, payload) {
  const values = [
    payload.name,
    payload.email,
    payload.role.toLowerCase(),
    payload.departmentId || null,
    payload.isActive,
  ];

  let query = 'UPDATE Users SET full_name = ?, email = ?, role = ?, department_id = ?, is_active = ?';

  if (payload.password) {
    query += ', password_hash = ?';
    values.push(payload.password);
  }

  query += ' WHERE user_id = ?';
  values.push(userId);

  const [result] = await db.query(query, values);
  return result.affectedRows > 0;
}

async function deleteUser(userId) {
  const [result] = await db.query('DELETE FROM Users WHERE user_id = ?', [userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
