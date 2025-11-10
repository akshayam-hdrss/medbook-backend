// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/", bookingController.createBooking);

// Update booking (status, remarks, date, time)
router.put("/:bookingId", bookingController.updateBooking);

// Get bookings by userId
router.get("/user/:userId", bookingController.getBookingsByUser);

// Get bookings by doctorId
router.get("/doctor/:doctorId", bookingController.getBookingsByDoctor);

router.get("/doctor/phone/:phone", bookingController.getDoctorByPhone);

router.get("/user/phone/:phone", bookingController.getUserByPhone);
module.exports = router;
