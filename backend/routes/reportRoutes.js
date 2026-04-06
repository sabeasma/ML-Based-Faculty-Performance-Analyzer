const express = require('express');
const { getReports, generateReport, downloadReport } = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getReports);
router.post('/generate', authenticate, generateReport);
router.get('/:reportId/download', authenticate, downloadReport);

module.exports = router;
