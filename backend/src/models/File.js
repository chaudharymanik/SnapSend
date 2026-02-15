const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        fileId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        s3Key: {
            type: String,
            required: true,
        },
        shareLink: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        maxDownloads: {
            type: Number,
            default: null, // null = unlimited
        },
        uploaderId: {
            type: String,
            default: 'anonymous',
        },
        isExpired: {
            type: Boolean,
            default: false,
        },
        isUploaded: {
            type: Boolean,
            default: false, // set to true after S3 upload confirmed
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient expiry queries
fileSchema.index({ expiresAt: 1, isExpired: 1 });

// Mark as expired on save if past expiry date
fileSchema.pre('save', function (next) {
    if (this.expiresAt < new Date()) {
        this.isExpired = true;
    }
    next();
});

module.exports = mongoose.model('File', fileSchema);
