const express = require('express');
const router = express.Router();
const primecareIconController = require('../controllers/primecareIconController');

router.post('/primecareicon', primecareIconController.createIcon);
router.get('/primecareicon', primecareIconController.getIcons);
router.put('/primecareicon/:id', primecareIconController.updateIcon);
router.delete('/primecareicon/:id', primecareIconController.deleteIcon);

module.exports = router;
