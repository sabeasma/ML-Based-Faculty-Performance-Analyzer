const express = require('express');
const { adminOverview, hodOverview, facultyOverview, facultyDashboard, studentOverview } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');
const { getFacultyByDepartment } = require('../controllers/facultyController');

const router = express.Router();

router.get('/admin-overview', authenticate, authorize('admin'), adminOverview);
router.get('/hod-overview', authenticate, authorize('hod', 'admin'), hodOverview);
router.get('/faculty-overview/:facultyId', authenticate, facultyOverview);
router.get('/admin', authenticate, authorize('admin'), adminOverview);
router.get('/hod', authenticate, authorize('hod', 'admin'), hodOverview);
router.get('/faculty', authenticate, authorize('faculty', 'admin'), facultyDashboard);
router.get('/student', authenticate, authorize('student', 'admin'), studentOverview);
router.get('/faculty/:facultyId', authenticate, facultyOverview);
router.get('/department/:id/faculty', authenticate, authorize('admin', 'hod'), getFacultyByDepartment);

module.exports = router;
