// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/", bookingController.createBooking);

// Get bookings by userId
router.get("/user/:userId", bookingController.getBookingsByUser);

// Get bookings by doctorId
router.get("/doctor/:doctorId", bookingController.getBookingsByDoctor);

module.exports = router;
