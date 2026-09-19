const express = require('express');
const {
  createReport,
  getReports,
  getReport,
  getNearbyReports,
  updateStatus,
  upvoteReport,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getReports)
  .post(protect, upload.single('image'), createReport);

router.get('/nearby', getNearbyReports);

router
  .route('/:id')
  .get(getReport);

router.patch('/:id/status', protect, authorize('admin', 'police'), updateStatus);
router.patch('/:id/upvote', protect, upvoteReport);

module.exports = router;