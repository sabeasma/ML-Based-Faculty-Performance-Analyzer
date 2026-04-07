const userService = require('../services/userService');

function handleDbError(error, res, fallbackMessage) {
  if (error && error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Duplicate value found', error: error.message });
  }

  return res.status(500).json({ success: false, message: fallbackMessage, error: error.message });
}

exports.getUsers = async (_req, res) => {
  try {
    const rows = await userService.listUsers();
    return res.json({ success: true, message: 'Users fetched successfully', data: rows });
  } catch (error) {
    return handleDbError(error, res, 'Failed to fetch users');
  }
};

exports.createUser = async (req, res) => {
  try {
    const created = await userService.createUser(req.body);
    return res.status(201).json({ success: true, message: 'User created successfully', data: created });
  } catch (error) {
    return handleDbError(error, res, 'Failed to create user');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User updated successfully', data: updated });
  } catch (error) {
    return handleDbError(error, res, 'Failed to update user');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const removed = await userService.removeUser(req.params.id);

    if (!removed) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User deleted successfully', data: { id: Number(req.params.id) } });
  } catch (error) {
    return handleDbError(error, res, 'Failed to delete user');
  }
};
