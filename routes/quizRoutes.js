const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// CRUD
router.post("/quiz", quizController.createQuizQuestion);         
router.get("/quiz", quizController.getQuizQuestions);            
router.get("/quiz/:id", quizController.getQuizQuestionById);      
router.put("/quiz/:id", quizController.updateQuizQuestion);       
router.delete("/quiz/:id", quizController.deleteQuizQuestion);    

module.exports = router;