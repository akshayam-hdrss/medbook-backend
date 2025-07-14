const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

// Available Product
router.get('/availableProduct', controller.getAllAvailableProducts);
router.post('/availableProduct', controller.addAvailableProduct);
router.put('/availableProduct/:id', controller.updateAvailableProduct);
router.delete('/availableProduct/:id', controller.deleteAvailableProduct);

// Product Type
router.get('/productType', controller.getAllProductTypes);
router.get('/productType/byAvailableProduct/:availableProductId', controller.getProductTypesByAvailableProductId);
router.post('/productType', controller.addProductType);
router.put('/productType/:id', controller.updateProductType);
router.delete('/productType/:id', controller.deleteProductType);

module.exports = router;
