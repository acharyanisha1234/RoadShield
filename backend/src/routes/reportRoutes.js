const express = require('express');
const {
  createReport,
  getReports,
  getReport,
  getNearbyReports,
  updateStatus,
  upvoteReport,
  getHotspots,
  getStats,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Analytics (must be BEFORE /:id)
router.get('/analytics/hotspots', getHotspots);
router.get('/analytics/stats', getStats);

router.get('/nearby', getNearbyReports);

router
  .route('/')
  .get(getReports)
  .post(protect, upload.single('image'), createReport);

router.route('/:id').get(getReport);

router.patch('/:id/status', protect, authorize('admin', 'police'), updateStatus);
router.patch('/:id/upvote', protect, upvoteReport);

module.exports = router;