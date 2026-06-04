const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(auth, authorize(['admin']));

router.get('/dashboard', adminController.getDashboardData);
router.get('/students', adminController.getStudents);
router.delete('/students/:id', adminController.deleteStudent);
router.put('/recruiters/:id/approve', adminController.approveRecruiter);
router.delete('/recruiters/:id', adminController.deleteRecruiter);
router.get('/jobs', adminController.getJobsListings);
router.put('/jobs/:id/moderate', adminController.moderateJob);
router.get('/placement-analytics', adminController.getPlacementAnalytics);
router.post('/reports/generate', adminController.generateReport);

module.exports = router;
