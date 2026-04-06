const express = require('express');
const {
	predictFacultyScore,
	getFacultyRankings,
	getModelMetrics,
	retrainModel,
	getModelRetrainStatus,
} = require('../controllers/mlController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/predict-score', authenticate, authorize('admin', 'hod'), predictFacultyScore);
router.get('/faculty-rankings', authenticate, getFacultyRankings);
router.get('/model-metrics', authenticate, getModelMetrics);
router.get('/retrain-status', authenticate, authorize('admin', 'hod'), getModelRetrainStatus);
router.post('/retrain', authenticate, authorize('admin'), retrainModel);

module.exports = router;
