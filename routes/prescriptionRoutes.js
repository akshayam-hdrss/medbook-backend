const express = require("express");
const {
  createPrescription,
  getPrescriptionsByDoctor,
  getPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionbyid,
  updateserviceid,
} = require("../controllers/prescriptionController");

const router = express.Router();

router.put("/updateserviceid/:id", updateserviceid);

router.post("/", createPrescription);

router.put("/", updatePrescription);

router.get("/getbyid/:id", getPrescriptionbyid);

router.get("/:DoctorID", getPrescriptionsByDoctor);

router.get("/:DoctorID/:prescriptionId", getPrescription);

router.put("/:DoctorID/:prescriptionId", updatePrescription);

router.delete("/:DoctorID/:prescriptionId", deletePrescription);

module.exports = router;
