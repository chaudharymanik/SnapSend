// Maximum file size in bytes (50 MB)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024;

// Pre-signed URL expiration times (seconds)
const UPLOAD_URL_EXPIRY = 900;   // 15 minutes
const DOWNLOAD_URL_EXPIRY = 300; // 5 minutes

// Valid expiry hour options the frontend can request
const ALLOWED_EXPIRY_HOURS = [1, 6, 24, 72, 168];

// MIME type prefixes that are allowed for upload
const ALLOWED_MIME_PREFIXES = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument',
    'application/vnd.ms-excel',
    'text/',
];

// File extensions that are always blocked
const BLOCKED_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.ps1',
    '.msi', '.app', '.deb', '.rpm',
    '.jar', '.php', '.com', '.scr',
    '.vbs', '.wsf', '.cpl', '.inf',
];

module.exports = {
    MAX_FILE_SIZE,
    UPLOAD_URL_EXPIRY,
    DOWNLOAD_URL_EXPIRY,
    ALLOWED_EXPIRY_HOURS,
    ALLOWED_MIME_PREFIXES,
    BLOCKED_EXTENSIONS,
};
