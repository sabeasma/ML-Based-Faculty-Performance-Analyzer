const express = require('express');
const {
	getAllFaculty,
	getFacultyById,
	createFaculty,
	getFacultyByDepartment,
	getMyPerformance,
} = require('../controllers/facultyController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getAllFaculty);
router.get('/my-performance', authenticate, authorize('faculty', 'admin', 'hod'), getMyPerformance);
router.get('/department/:id', authenticate, authorize('admin', 'hod'), getFacultyByDepartment);
router.get('/:id', authenticate, getFacultyById);
router.post('/', authenticate, authorize('admin', 'hod'), createFaculty);

module.exports = router;
