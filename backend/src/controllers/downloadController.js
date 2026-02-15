const File = require('../models/File');
const { generateDownloadUrl } = require('../services/s3Service');

/**
 * GET /api/download/:linkId
 * Validates expiry and returns a pre-signed GET URL for download.
 */
exports.getDownloadUrl = async (req, res) => {
    try {
        const { linkId } = req.params;

        const file = await File.findOne({ shareLink: linkId });

        if (!file) {
            return res.status(404).json({ error: 'Link not found' });
        }

        // Must be uploaded
        if (!file.isUploaded) {
            return res.status(404).json({ error: 'File not available' });
        }

        // Check expiry
        if (new Date() > file.expiresAt || file.isExpired) {
            file.isExpired = true;
            await file.save();
            return res.status(410).json({ error: 'This link has expired' });
        }

        // Check download limit
        if (file.maxDownloads !== null && file.downloadCount >= file.maxDownloads) {
            return res.status(403).json({ error: 'Download limit reached' });
        }

        // Generate pre-signed GET URL (valid 5 minutes)
        const downloadUrl = await generateDownloadUrl(file.s3Key, file.originalName);

        // Increment download count
        file.downloadCount += 1;
        await file.save();

        res.json({
            downloadUrl,
            expiresIn: 300,
        });
    } catch (error) {
        console.error('Download URL error:', error);
        res.status(500).json({ error: 'Failed to generate download URL' });
    }
};
