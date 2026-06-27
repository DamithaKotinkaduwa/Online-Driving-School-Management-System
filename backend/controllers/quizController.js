const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// Admin creates a quiz
const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: req.user._id
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer'); // hide answers for students
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single quiz
const getQuizById = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // If student, hide correct answer
    if (req.user.role === 'Student') {
      const quizObj = quiz.toObject();
      quizObj.questions.forEach(q => delete q.correctAnswer);
      return res.json(quizObj);
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student submits a quiz
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of answers mapping to question IDs or indexes
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });
    
    const passed = score / quiz.questions.length >= 0.7; // 70% passing mark
    
    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      studentId: req.user._id,
      score,
      totalQuestions: quiz.questions.length,
      passed
    });
    
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my quiz attempts
const getMyQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ studentId: req.user._id }).populate('quizId', 'title');
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuiz,
  getMyQuizAttempts
};
