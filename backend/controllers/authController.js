const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

function signToken(user) {
  return jwt.sign(
    {
      userId: user.user_id,
      role: user.role,
      departmentId: user.department_id,
    },
    process.env.JWT_SECRET || 'super-secret-jwt-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function isBcryptHash(value) {
  return typeof value === 'string' && (value.startsWith('$2a$') || value.startsWith('$2b$') || value.startsWith('$2y$'));
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await db.query(
      'SELECT user_id, full_name, email, role, department_id, password_hash FROM Users WHERE email = ? AND is_active = 1 LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = isBcryptHash(user.password_hash)
      ? await bcrypt.compare(password, user.password_hash)
      : password === user.password_hash;

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      token,
      role: user.role,
      userData: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        departmentId: user.department_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, departmentId } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Users (full_name, email, password_hash, role, department_id) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, hash, role, departmentId || null]
    );

    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};
