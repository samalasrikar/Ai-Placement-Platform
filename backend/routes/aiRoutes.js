const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth } = require('../middleware/authMiddleware');

router.post('/resume-analyzer', auth, aiController.analyzeResume);
router.post('/chatbot', auth, aiController.chatbotChat);
router.post('/mock-interview/questions', auth, aiController.getMockInterviewQuestions);
router.post('/mock-interview/feedback', auth, aiController.submitInterviewFeedback);

module.exports = router;
