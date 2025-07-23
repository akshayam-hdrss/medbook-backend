const express = require('express');
const router = express.Router();

const {
  authenticateToken,
  postComplaint,
  getAllComplaints,
  getUserComplaints,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');

// POST complaint
router.post('/complaint', authenticateToken, postComplaint);

// GET all complaints
router.get('/complaints', getAllComplaints);

// GET logged-in user's complaints
router.get('/complaints/user', authenticateToken, getUserComplaints);

// PUT: Update complaint by ID
router.put('/complaint/user/:id', authenticateToken, updateComplaint);

// DELETE: Delete complaint by ID
router.delete('/complaint/user/:id', authenticateToken, deleteComplaint);

module.exports = router;
