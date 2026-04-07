const express = require('express');
const { body, param } = require('express-validator');
const {
	getFaculty,
	getFacultyById,
	createFaculty,
	updateFaculty,
	deleteFaculty,
} = require('../controllers/facultyCrudController');
const {
	getFacultyByDepartment,
	getMyPerformance,
} = require('../controllers/facultyController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

const facultyBodyValidation = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('Valid email is required'),
	body('departmentId').isInt({ min: 1 }).withMessage('departmentId must be a positive integer'),
	body('qualification').trim().notEmpty().withMessage('Qualification is required'),
	body('experience').isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
	body('subjectsHandled').isInt({ min: 0 }).withMessage('Subjects handled must be a non-negative integer'),
	body('attendancePercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Attendance must be 0-100'),
	body('researchPublications').optional().isInt({ min: 0 }).withMessage('Research publications must be non-negative'),
	body('researchImpactScore').optional().isFloat({ min: 0 }).withMessage('Research impact score must be non-negative'),
	body('studentFeedbackScore').optional().isFloat({ min: 0, max: 100 }).withMessage('Feedback score must be 0-100'),
	body('mlScore').optional().isFloat({ min: 0, max: 100 }).withMessage('ML score must be 0-100'),
];

router.get('/', authenticate, authorize('admin', 'hod', 'student', 'faculty'), getFaculty);
router.get('/my-performance', authenticate, authorize('faculty', 'admin', 'hod'), getMyPerformance);
router.get('/department/:id', authenticate, authorize('admin', 'hod'), getFacultyByDepartment);
router.get('/:id', authenticate, authorize('admin', 'hod'), param('id').isInt({ min: 1 }), validateRequest, getFacultyById);
router.post('/', authenticate, authorize('admin', 'hod'), facultyBodyValidation, validateRequest, createFaculty);
router.put('/:id', authenticate, authorize('admin', 'hod'), param('id').isInt({ min: 1 }), facultyBodyValidation, validateRequest, updateFaculty);
router.delete('/:id', authenticate, authorize('admin', 'hod'), param('id').isInt({ min: 1 }), validateRequest, deleteFaculty);

module.exports = router;
