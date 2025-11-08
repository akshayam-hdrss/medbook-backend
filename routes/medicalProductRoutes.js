const express = require("express");
const {
  addMedicalProduct,
  getMedicalProductsByDoctor,
  updateMedicalProduct,
  deleteMedicalProduct
} = require("../controllers/medicalProductController");

const router = express.Router();

router.post("/", addMedicalProduct);
router.get("/:doctorId", getMedicalProductsByDoctor);
router.put("/:id", updateMedicalProduct);
router.delete("/:id", deleteMedicalProduct);

module.exports = router;
