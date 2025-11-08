const express = require("express");
const {
    createPrescription,
  getPrescriptionsByDoctor,
  getPrescription,
  updatePrescription,
  deletePrescription
} = require("../controllers/prescriptionController");

const router = express.Router();

router.post('/', createPrescription);

// 📍 All prescriptions for a doctor
router.get("/:DoctorID", getPrescriptionsByDoctor);

// 📍 Specific prescription
router.get("/:DoctorID/:prescriptionId", getPrescription);

// 📍 Update
router.put("/:DoctorID/:prescriptionId", updatePrescription);

// 📍 Delete
router.delete("/:DoctorID/:prescriptionId", deletePrescription);

module.exports = router;
