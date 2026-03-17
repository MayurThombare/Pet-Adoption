const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getApplication,
  getAllApplications,
  reviewApplication,
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');
const { applicationValidator } = require('../validators');

// User routes
router.post('/', authenticate, authorize('user', 'admin'), applicationValidator, createApplication);
router.get('/my', authenticate, authorize('user', 'admin'), getMyApplications);
router.get('/:id', authenticate, getApplication);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllApplications);
router.patch('/:id/review', authenticate, authorize('admin'), reviewApplication);

module.exports = router;
