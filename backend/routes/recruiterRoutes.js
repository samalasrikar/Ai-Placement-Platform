const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', auth, authorize(['recruiter']), recruiterController.getDashboardData);
router.post('/company-profile', auth, authorize(['recruiter']), recruiterController.updateCompanyProfile);
router.post('/jobs', auth, authorize(['recruiter']), recruiterController.postJob);
router.put('/jobs/:id', auth, authorize(['recruiter']), recruiterController.editJob);
router.delete('/jobs/:id', auth, authorize(['recruiter']), recruiterController.deleteJob);
router.get('/applicants', auth, authorize(['recruiter']), recruiterController.getApplicants);
router.post('/schedule-interview', auth, authorize(['recruiter']), recruiterController.scheduleInterview);
router.put('/applications/:id/status', auth, authorize(['recruiter']), recruiterController.updateApplicationStatus);

module.exports = router;
