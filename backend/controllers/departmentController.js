const departmentService = require('../services/departmentService');

function handleDbError(error, res, fallbackMessage) {
  if (error && error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Department already exists', error: error.message });
  }

  return res.status(500).json({ success: false, message: fallbackMessage, error: error.message });
}

exports.getDepartments = async (_req, res) => {
  try {
    const rows = await departmentService.listDepartments();
    return res.json({ success: true, message: 'Departments fetched successfully', data: rows });
  } catch (error) {
    return handleDbError(error, res, 'Failed to fetch departments');
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const created = await departmentService.createDepartment(req.body);
    return res.status(201).json({ success: true, message: 'Department created successfully', data: created });
  } catch (error) {
    return handleDbError(error, res, 'Failed to create department');
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const updated = await departmentService.updateDepartment(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    return res.json({ success: true, message: 'Department updated successfully', data: updated });
  } catch (error) {
    return handleDbError(error, res, 'Failed to update department');
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const removed = await departmentService.removeDepartment(req.params.id);

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    return res.json({ success: true, message: 'Department deleted successfully', data: { id: Number(req.params.id) } });
  } catch (error) {
    return handleDbError(error, res, 'Failed to delete department');
  }
};
