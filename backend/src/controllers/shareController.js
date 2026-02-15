const File = require('../models/File');

/**
 * GET /api/share/:linkId
 * Returns file metadata for the share/download page.
 */
exports.getShareInfo = async (req, res) => {
    try {
        const { linkId } = req.params;

        const file = await File.findOne({ shareLink: linkId });

        if (!file) {
            return res.status(404).json({ error: 'Link not found' });
        }

        // Check if uploaded
        if (!file.isUploaded) {
            return res.status(404).json({ error: 'File upload not yet completed' });
        }

        // Check if expired
        if (new Date() > file.expiresAt || file.isExpired) {
            file.isExpired = true;
            await file.save();
            return res.status(410).json({ error: 'This link has expired' });
        }

        // Check download limit
        if (file.maxDownloads !== null && file.downloadCount >= file.maxDownloads) {
            return res.status(403).json({ error: 'Download limit reached' });
        }

        res.json({
            fileId: file.fileId,
            originalName: file.originalName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            expiresAt: file.expiresAt,
            downloadCount: file.downloadCount,
            uploadedAt: file.uploadedAt,
        });
    } catch (error) {
        console.error('Share info error:', error);
        res.status(500).json({ error: 'Failed to retrieve file info' });
    }
};
