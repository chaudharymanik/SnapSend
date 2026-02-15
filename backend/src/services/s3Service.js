const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/s3');
const { UPLOAD_URL_EXPIRY, DOWNLOAD_URL_EXPIRY } = require('../config/constants');

/**
 * Generate a pre-signed PUT URL for direct client-to-S3 upload.
 */
async function generateUploadUrl(s3Key, contentType, contentLength, metadata = {}) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        ContentType: contentType,
        ContentLength: contentLength,
        Metadata: metadata,
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: UPLOAD_URL_EXPIRY,
    });

    return url;
}

/**
 * Generate a pre-signed GET URL for direct S3-to-client download.
 */
async function generateDownloadUrl(s3Key, originalFileName) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        ResponseContentDisposition: `attachment; filename="${encodeURIComponent(originalFileName)}"`,
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: DOWNLOAD_URL_EXPIRY,
    });

    return url;
}

module.exports = { generateUploadUrl, generateDownloadUrl };
