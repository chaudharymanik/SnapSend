const express = require('express');
const router = express.Router();
const { downloadLimiter } = require('../middleware/rateLimiter');
const downloadController = require('../controllers/downloadController');

// GET /api/download/:linkId — get pre-signed download URL
router.get('/:linkId', downloadLimiter, downloadController.getDownloadUrl);

module.exports = router;
