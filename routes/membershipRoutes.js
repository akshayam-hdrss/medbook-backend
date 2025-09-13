const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");

router.post("/", membershipController.addMembership);   // ✅ fix here
router.get("/", membershipController.getAllMemberships);
router.get("/:id", membershipController.getMembershipById);
router.put("/:id", membershipController.updateMembership);
router.delete("/:id", membershipController.deleteMembership);

module.exports = router;
