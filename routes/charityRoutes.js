const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charityController');


router.post('/', charityController.createCharity);
router.get('/', charityController.getAllCharities);
router.get('/:id', charityController.getCharityById);
router.put('/:id', charityController.updateCharity);
router.delete('/:id', charityController.deleteCharity);

module.exports = router;