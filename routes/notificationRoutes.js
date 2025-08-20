// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead
} = require('../controllers/notificationController');

router.get('/:userId', getNotifications);
router.put('/:id/read', markRead);
router.put('/read-all/:userId', markAllRead);

module.exports = router;
