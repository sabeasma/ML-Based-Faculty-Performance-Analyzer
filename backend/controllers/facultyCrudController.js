const facultyService = require('../services/facultyService');

function handleDbError(error, res, fallbackMessage) {
  if (error && error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Duplicate value found', error: error.message });
  }

  return res.status(500).json({ success: false, message: fallbackMessage, error: error.message });
}

exports.getFaculty = async (_req, res) => {
  try {
    const rows = await facultyService.listFaculty();
    return res.json({ success: true, message: 'Faculty fetched successfully', data: rows });
  } catch (error) {
    return handleDbError(error, res, 'Failed to fetch faculty');
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await facultyService.getFacultyById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    return res.json({ success: true, message: 'Faculty fetched successfully', data: faculty });
  } catch (error) {
    return handleDbError(error, res, 'Failed to fetch faculty');
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const created = await facultyService.createFaculty(req.body);
    return res.status(201).json({ success: true, message: 'Faculty created successfully', data: created });
  } catch (error) {
    return handleDbError(error, res, 'Failed to create faculty');
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const updated = await facultyService.updateFaculty(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    return res.json({ success: true, message: 'Faculty updated successfully', data: updated });
  } catch (error) {
    return handleDbError(error, res, 'Failed to update faculty');
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const removed = await facultyService.removeFaculty(req.params.id);

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    return res.json({ success: true, message: 'Faculty deleted successfully', data: { id: Number(req.params.id) } });
  } catch (error) {
    return handleDbError(error, res, 'Failed to delete faculty');
  }
};
