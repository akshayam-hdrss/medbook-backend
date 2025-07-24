const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// GET /api/schedule/ → Get all schedules
router.get('/', scheduleController.getAllSchedules);

// POST /api/schedule/ → Create a new schedule
router.post('/', scheduleController.createSchedule);

module.exports = router;
