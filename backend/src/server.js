const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDatabase = require('./config/database');
const uploadRoutes = require('./routes/upload');
const shareRoutes = require('./routes/share');
const downloadRoutes = require('./routes/download');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const startExpiryJobs = require('./services/expiryService');

const app = express();

// ── Security middleware ──────────────────────────────
app.use(helmet());

const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(apiLimiter);

// ── Database connection (lazy, once) ─────────────────
let dbConnected = false;
app.use(async (_req, _res, next) => {
    if (!dbConnected) {
        await connectDatabase();
        dbConnected = true;
    }
    next();
});

// ── Routes ───────────────────────────────────────────
app.use('/api/upload', uploadRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/download', downloadRoutes);

// ── Health check ─────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error handler ────────────────────────────────────
app.use(errorHandler);

// ── Export for Vercel serverless ──────────────────────
module.exports = app;

// ── Local development server ─────────────────────────
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectDatabase().then(() => {
        dbConnected = true;
        startExpiryJobs();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }).catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}
