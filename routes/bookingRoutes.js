// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  updateStatusByDoctor,
  userAcceptReschedule,
  userCancelBooking,
  getBooking,
  listBookings
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.put('/:id/status', updateStatusByDoctor);
router.put('/:id/accept-reschedule', userAcceptReschedule);
router.put('/:id/user-cancel', userCancelBooking);
router.get('/:id', getBooking);
router.get('/', listBookings);

module.exports = router;
