const { body, validationResult } = require('express-validator');
const { MAX_FILE_SIZE, ALLOWED_EXPIRY_HOURS } = require('../config/constants');

// Validation rules for upload request
const uploadValidation = [
    body('fileName')
        .isString()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Filename must be between 1 and 255 characters'),

    body('fileSize')
        .isInt({ min: 1, max: MAX_FILE_SIZE })
        .withMessage(`File size must be between 1 byte and ${MAX_FILE_SIZE / 1024 / 1024}MB`),

    body('mimeType')
        .isString()
        .trim()
        .matches(/^[a-z]+\/[a-z0-9.+\-]+$/i)
        .withMessage('Invalid MIME type format'),

    body('expiryHours')
        .isInt({ min: 1, max: 168 })
        .isIn(ALLOWED_EXPIRY_HOURS)
        .withMessage(`Expiry must be one of: ${ALLOWED_EXPIRY_HOURS.join(', ')} hours`),

    // Honeypot field — bots fill hidden fields
    body('website')
        .optional()
        .custom((value) => {
            if (value && value.length > 0) {
                throw new Error('Invalid request');
            }
            return true;
        }),
];

// Middleware that checks validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { uploadValidation, handleValidationErrors };
