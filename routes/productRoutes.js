const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

// Available Product Types
router.get('/availableProductType', controller.getAllAvailableProductsType);
router.post('/availableProductType', controller.addAvailableProductType);
router.put('/availableProductType/:id', controller.updateAvailableProductType);
router.delete('/availableProductType/:id', controller.deleteAvailableProductType);

// Available Product
router.get('/availableProduct/:id', controller.getAvailableProductsByType);
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

// Product routes
router.post('/product', controller.addProduct);
router.get('/product/byProductType/:productTypeId', controller.getProductsByProductTypeId);
router.get('/product/:id', controller.getProductById);
router.put('/product/:id', controller.updateProduct);
router.delete('/product/:id', controller.deleteProduct);

module.exports = router;
