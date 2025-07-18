const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/topdoctors', doctorController.getTopDoctors);
// Doctor routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', doctorController.addDoctor);
router.put('/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

// Doctor review routes
router.post('/:id/review', doctorController.addReview);
router.get('/:id/reviews', doctorController.getReviews);

module.exports = router;