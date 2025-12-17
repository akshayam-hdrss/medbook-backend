const express = require('express');
const router = express.Router();
const serviceBillingController = require('../controllers/serviceBillingController');

router.post('/create-bill', serviceBillingController.createBill);
router.get('/service/:serviceId', serviceBillingController.getBillingByServiceId);
router.get('/user/:userId', serviceBillingController.getBillingByUserId);
router.get('/booking/:bookingId', serviceBillingController.getBillingByBookingId);
router.put('/update/:id', serviceBillingController.updateBillingStatus);

module.exports = router;
