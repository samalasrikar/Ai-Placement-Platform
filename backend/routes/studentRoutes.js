const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth, authorize } = require('../middleware/authMiddleware');

// Secure routes for students only
router.get('/dashboard', auth, authorize(['student']), studentController.getDashboardData);
router.post('/profile', auth, authorize(['student']), studentController.updateProfile);
router.get('/jobs', auth, studentController.getJobsListings);
router.get('/jobs/:id', auth, studentController.getJobDetails);
router.post('/apply', auth, authorize(['student']), studentController.applyJob);
router.get('/applications', auth, authorize(['student']), studentController.getAppliedJobs);
router.get('/notifications', auth, studentController.getNotifications);
router.put('/notifications/:id/read', auth, studentController.markNotificationRead);

module.exports = router;
