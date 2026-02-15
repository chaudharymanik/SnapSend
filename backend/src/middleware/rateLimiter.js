const rateLimit = require('express-rate-limit');

// Upload rate limiter — 10 uploads per IP per day
// Keeps us safely within S3 free tier (2,000 PUTs/month)
const uploadLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10,
    message: { error: 'Upload limit reached. Try again tomorrow.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Download rate limiter — 20 downloads per IP per 15 minutes
// Keeps us within 20,000 GETs/month
const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many download requests. Please wait.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter — 100 requests per IP per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { uploadLimiter, downloadLimiter, apiLimiter };
