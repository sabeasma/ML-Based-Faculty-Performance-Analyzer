const express = require('express');
const { submitCourseFeedback, getCourseFeedback } = require('../controllers/courseFeedbackController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('student', 'admin'), submitCourseFeedback);
router.get('/', authenticate, getCourseFeedback);

module.exports = router;
