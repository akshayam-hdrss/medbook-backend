const express = require('express');
const {
  getAllTraditionalTypes,
  addTraditionalType,
  updateTraditionalType,
  deleteTraditionalType,
  getAllTraditionals,
  addTraditional,
  updateTraditional,
  deleteTraditional,
  getTraditionalsByType,
} = require('../controllers/traditionalController');

const router = express.Router();

// Traditional Type routes
router.get('/traditionalType', getAllTraditionalTypes);
router.post('/traditionalType', addTraditionalType);
router.put('/traditionalType/:id', updateTraditionalType);
router.delete('/traditionalType/:id', deleteTraditionalType);

// Traditional routes
router.get('/traditional', getAllTraditionals);
router.get('/traditional/:traditionalTypeId', getTraditionalsByType);
router.post('/traditional', addTraditional);
router.put('/traditional/:id', updateTraditional);
router.delete('/traditional/:id', deleteTraditional);

module.exports = router;