const express = require('express');
const router = express.Router();
const offersController = require('../controllers/offersController');

// Routes
router.get('/', offersController.getAllOffers);
router.get('/:id', offersController.getOfferById);
router.post('/', offersController.createOffer);
router.put('/:id', offersController.updateOffer);
router.delete('/:id', offersController.deleteOffer);

module.exports = router;