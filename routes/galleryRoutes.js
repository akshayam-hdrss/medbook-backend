
const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.get('/categories', galleryController.getGalleryCategories);
router.post('/gallery', galleryController.createGallery);
router.get('/gallery/:category', galleryController.getGallery);
router.put('/gallery/:id', galleryController.updateGallery);
router.delete('/gallery/:id', galleryController.deleteGallery);
router.get('/correctGallery/:category', galleryController.getCorrectGallery);


module.exports = router;
