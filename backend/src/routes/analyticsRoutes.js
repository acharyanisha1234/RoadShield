/**
 * Analytics Routes
 * Exposes AI-powered analytics endpoints
 */

const express = require('express');
const router = express.Router();

const { getHotspots, getStats } = require('../controllers/reportController');

// Public analytics endpoints
router.get('/hotspots', getHotspots);
router.get('/stats', getStats);

module.exports = router;