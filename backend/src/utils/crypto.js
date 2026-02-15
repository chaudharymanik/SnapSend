const crypto = require('crypto');

/**
 * Generate a unique file ID (32-character hex string).
 */
function generateId() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Generate a URL-safe token for share links.
 */
function generateToken(bytes = 12) {
    return crypto.randomBytes(bytes).toString('base64url');
}

module.exports = { generateId, generateToken };
