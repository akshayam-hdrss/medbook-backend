const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Available Services
router.get('/available-services', serviceController.getAllAvailableServices);
router.post('/available-services', serviceController.addAvailableService);
router.put('/available-services/:id', serviceController.updateAvailableService);
router.delete('/available-services/:id', serviceController.deleteAvailableService);

// Service Types
router.get('/service-types/:availableServiceId', serviceController.getServiceTypesByAvailableServiceId);
router.post('/service-types', serviceController.addServiceType);
router.put('/service-types/:id', serviceController.updateServiceType);
router.delete('/service-types/:id', serviceController.deleteServiceType);

// Service Details
router.post('/service', serviceController.addService);
router.put('/service/:id', serviceController.updateService);
router.get('/service/:id', serviceController.getServiceById);
router.get('/services-by-type/:serviceTypeId', serviceController.getServicesByServiceTypeId);
router.delete('/service/:id', serviceController.deleteService);
router.get('/all', serviceController.getAllServices);


module.exports = router;
