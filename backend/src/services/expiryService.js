const cron = require('node-cron');
const File = require('../models/File');

/**
 * Mark expired files in the database every hour.
 * S3 lifecycle rules handle actual object deletion.
 */
function startExpiryJobs() {
    // Every hour — mark expired files
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const result = await File.updateMany(
                { expiresAt: { $lt: now }, isExpired: false },
                { $set: { isExpired: true } }
            );
            if (result.modifiedCount > 0) {
                console.log(`⏰ Marked ${result.modifiedCount} file(s) as expired`);
            }
        } catch (error) {
            console.error('Expiry cron error:', error);
        }
    });

    // Daily at 2 AM — delete old database records (older than 30 days)
    cron.schedule('0 2 * * *', async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const result = await File.deleteMany({
                expiresAt: { $lt: thirtyDaysAgo },
                isExpired: true,
            });

            if (result.deletedCount > 0) {
                console.log(`🗑️  Cleaned up ${result.deletedCount} old record(s)`);
            }
        } catch (error) {
            console.error('Cleanup cron error:', error);
        }
    });

    console.log('⏰ Expiry cron jobs started');
}

module.exports = startExpiryJobs;
