const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/medbook', (req, res) => {
    const filePath = path.join(__dirname, '..', 'config', 'Medbook.pdf');
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

module.exports = router;
