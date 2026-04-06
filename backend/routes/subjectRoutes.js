const express = require('express');
const { getSubjects } = require('../controllers/subjectController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getSubjects);

module.exports = router;
