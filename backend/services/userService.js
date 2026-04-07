const userModel = require('../models/userModel');

function normalizeUserPayload(body = {}) {
  return {
    name: body.name,
    email: body.email,
    password: body.password || null,
    role: String(body.role || '').toUpperCase(),
    departmentId: body.departmentId ? Number(body.departmentId) : null,
    isActive: body.isActive === undefined ? 1 : Number(body.isActive),
  };
}

async function listUsers() {
  return userModel.getAllUsers();
}

async function createUser(body) {
  const payload = normalizeUserPayload(body);
  payload.password = payload.password || 'password123';
  const id = await userModel.createUser(payload);
  const users = await userModel.getAllUsers();
  return users.find((user) => Number(user.id) === Number(id)) || null;
}

async function updateUser(id, body) {
  const payload = normalizeUserPayload(body);
  const updated = await userModel.updateUser(Number(id), payload);

  if (!updated) {
    return null;
  }

  const users = await userModel.getAllUsers();
  return users.find((user) => Number(user.id) === Number(id)) || null;
}

async function removeUser(id) {
  return userModel.deleteUser(Number(id));
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  removeUser,
};
