const express = require('express');
const {
  getAllHospitalTypes,
  addHospitalType,
  updateHospitalType,
  deleteHospitalType,
  getAllHospitals,
  addHospital,
  updateHospital,
  deleteHospital,
  getHospitalsByType,
} = require('../controllers/hospitalController');

const router = express.Router();

router.get('/hospitalType', getAllHospitalTypes);
router.post('/hospitalType', addHospitalType);
router.put('/hospitalType/:id', updateHospitalType);
router.delete('/hospitalType/:id', deleteHospitalType);

router.get('/hospital', getAllHospitals);
router.get('/hospital/:hospitalTypeId', getHospitalsByType);
router.post('/hospital', addHospital);
router.put('/hospital/:id', updateHospital);
router.delete('/hospital/:id', deleteHospital);

module.exports = router;