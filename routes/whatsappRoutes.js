
const express = require('express');
const router = express.Router();
const { sendWhatsappMessage } = require('../controllers/whatsappController');

router.post('/send-whatsapp', sendWhatsappMessage);

module.exports = router;
