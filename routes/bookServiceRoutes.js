// routes/bookServiceRoute.js
const express = require("express");
const router = express.Router();
const bookServiceController = require("../controllers/bookServiceController");

// 🔍 Get Service Provider by Phone
router.get("/service/phone/:phone", bookServiceController.getServiceByPhone);

// 🟢 Create service booking
router.post("/", bookServiceController.createServiceBooking);

// ✏ Update service booking
router.put("/:bookingId", bookServiceController.updateServiceBooking);

// 📌 Get bookings by userId
router.get("/user/:userId", bookServiceController.getServiceBookingsByUser);

// 📌 Get bookings by service provider
router.get("/service/:serviceId", bookServiceController.getBookingsByService);

module.exports = router;
