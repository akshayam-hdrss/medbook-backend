const express = require('express');
const router = express.Router();
const doctorTypeController = require('../controllers/doctorTypeController');

router.get('/', doctorTypeController.getAllDoctorTypes);
router.post('/', doctorTypeController.addDoctorType);
router.put('/:id', doctorTypeController.updateDoctorType);
router.delete('/:id', doctorTypeController.deleteDoctorType);

module.exports = router;
