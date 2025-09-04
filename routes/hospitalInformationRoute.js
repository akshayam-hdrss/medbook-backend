const express = require("express");
const router = express.Router();
const hospitalInformationController = require("../controllers/hospitalInformationcontroller");

// CREATE
router.post("/", hospitalInformationController.createHospitalInformation);

// READ ALL
router.get("/", hospitalInformationController.getAllHospitalInformation);

// READ ONE (by hospitalId)
router.get("/hospital/:hospitalId", hospitalInformationController.getHospitalInformationByHospitalId);

// UPDATE (by hospitalId)
router.put("/hospital/:hospitalId", hospitalInformationController.updateHospitalInformationByHospitalId);

// DELETE (by hospitalId)
router.delete("/hospital/:hospitalId", hospitalInformationController.deleteHospitalInformation);

module.exports = router;