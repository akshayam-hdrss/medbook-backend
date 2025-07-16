const express = require('express');
const router = express.Router();

const {
  authenticateToken,
  postComplaint,
  getAllComplaints,
  getUserComplaints
} = require('../controllers/complaintController');

// POST complaint
router.post('/complaint', authenticateToken, postComplaint);

// GET all complaints
router.get('/complaints', getAllComplaints);

// GET logged-in user's complaints
router.get('/complaints/user', authenticateToken, getUserComplaints);

module.exports = router;
