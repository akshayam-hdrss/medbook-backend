const express = require("express");
const router = express.Router();
const  userdataController= require( "../controllers/quiz_userdatacontroller");



router.post("/",userdataController.addStageData);         
router.get("/", userdataController.getAllStageData);      
router.get("/:userId", userdataController.getUserStageData); 
router.get("/:userId/progress", userdataController.getUserProgress);
router.get("/:userId/result", userdataController.getUserResult);
router.put("/:userId", userdataController.updateUserStageData);
router.delete("/:userId", userdataController.deleteUserStageData);

module.exports = router;