const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// GET /api/share/:linkId — get file info for share page
router.get('/:linkId', shareController.getShareInfo);

module.exports = router;
