const express = require('express');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('student', 'admin'), submitFeedback);
router.get('/', authenticate, getFeedback);

module.exports = router;
