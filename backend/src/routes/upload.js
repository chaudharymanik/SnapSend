const express = require('express');
const router = express.Router();
const { uploadLimiter } = require('../middleware/rateLimiter');
const { uploadValidation, handleValidationErrors } = require('../middleware/validation');
const uploadController = require('../controllers/uploadController');

// POST /api/upload/request — get pre-signed URL
router.post(
    '/request',
    uploadLimiter,
    uploadValidation,
    handleValidationErrors,
    uploadController.requestUpload
);

// POST /api/upload/confirm/:fileId — confirm upload completion
router.post('/confirm/:fileId', uploadController.confirmUpload);

module.exports = router;
