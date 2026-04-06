const express = require('express');
const { predictFacultyScore, getFacultyRankings, getModelMetrics } = require('../controllers/mlController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/predict-score', authenticate, authorize('admin', 'hod'), predictFacultyScore);
router.get('/faculty-rankings', authenticate, getFacultyRankings);
router.get('/model-metrics', authenticate, getModelMetrics);

module.exports = router;
