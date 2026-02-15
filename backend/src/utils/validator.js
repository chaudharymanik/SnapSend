const { ALLOWED_MIME_PREFIXES, BLOCKED_EXTENSIONS } = require('../config/constants');

/**
 * Check if a file is allowed based on its name and MIME type.
 * @returns {boolean}
 */
function isFileAllowed(fileName, mimeType) {
    // Check blocked extensions
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(extension)) {
        return false;
    }

    // Check MIME type against allowed prefixes
    return ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
}

/**
 * Sanitize a filename for safe S3 storage.
 */
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

module.exports = { isFileAllowed, sanitizeFileName };
