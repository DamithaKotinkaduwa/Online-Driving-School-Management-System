const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  submitQuiz, 
  getMyQuizAttempts 
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin'), createQuiz);
router.get('/', protect, getQuizzes);
router.get('/my-attempts', protect, authorize('Student'), getMyQuizAttempts);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, authorize('Student'), submitQuiz);

module.exports = router;
