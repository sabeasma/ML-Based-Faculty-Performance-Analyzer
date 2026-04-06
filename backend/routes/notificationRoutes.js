const express = require('express');
const { getNotifications, markNotificationsRead } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.post('/read', authenticate, markNotificationsRead);

module.exports = router;
