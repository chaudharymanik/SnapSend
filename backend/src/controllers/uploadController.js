const File = require('../models/File');
const { generateUploadUrl } = require('../services/s3Service');
const { generateShareToken, generateFileId } = require('../services/linkService');
const { isFileAllowed, sanitizeFileName } = require('../utils/validator');
const { MAX_FILE_SIZE, ALLOWED_MIME_PREFIXES } = require('../config/constants');

/**
 * POST /api/upload/request
 * Validates the file, creates a DB record, and returns a pre-signed PUT URL.
 */
exports.requestUpload = async (req, res) => {
    try {
        const { fileName, fileSize, mimeType, expiryHours } = req.body;

        // Validate file type
        if (!isFileAllowed(fileName, mimeType)) {
            return res.status(400).json({ error: 'File type not allowed' });
        }

        // Validate file size
        if (fileSize > MAX_FILE_SIZE) {
            return res.status(400).json({
                error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
            });
        }

        // Generate unique identifiers
        const fileId = generateFileId();
        const shareToken = generateShareToken();
        const sanitized = sanitizeFileName(fileName);
        const s3Key = `uploads/${fileId}/${sanitized}`;

        // Calculate expiry
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiryHours);

        // Generate pre-signed URL for direct S3 upload
        const uploadUrl = await generateUploadUrl(s3Key, mimeType, fileSize, {
            'original-name': fileName,
            'file-id': fileId,
            'expires-at': expiresAt.toISOString(),
        });

        // Save record to MongoDB (status: pending upload)
        const fileRecord = new File({
            fileId,
            originalName: fileName,
            fileName: sanitized,
            fileSize,
            mimeType,
            s3Key,
            shareLink: shareToken,
            expiresAt,
            isUploaded: false,
        });

        await fileRecord.save();

        res.status(201).json({
            uploadUrl,
            fileId,
            s3Key,
            shareLink: shareToken,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error('Upload request error:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
};

/**
 * POST /api/upload/confirm/:fileId
 * Marks a file as successfully uploaded after the client finishes S3 upload.
 */
exports.confirmUpload = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findOne({ fileId });

        if (!file) {
            return res.status(404).json({ error: 'File record not found' });
        }

        if (file.isUploaded) {
            return res.status(200).json({ message: 'Already confirmed' });
        }

        file.isUploaded = true;
        await file.save();

        res.json({
            message: 'Upload confirmed',
            shareLink: file.shareLink,
            expiresAt: file.expiresAt,
        });
    } catch (error) {
        console.error('Upload confirm error:', error);
        res.status(500).json({ error: 'Failed to confirm upload' });
    }
};
