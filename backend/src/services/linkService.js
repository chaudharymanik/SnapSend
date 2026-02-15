const crypto = require('crypto');

/**
 * Generate a URL-safe share token (16 chars).
 */
function generateShareToken() {
    return crypto.randomBytes(12).toString('base64url');
}

/**
 * Generate a unique file ID (32-char hex).
 */
function generateFileId() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = { generateShareToken, generateFileId };
