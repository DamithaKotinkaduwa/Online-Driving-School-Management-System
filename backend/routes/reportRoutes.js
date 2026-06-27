const express = require('express');
const router = express.Router();
const { createReport, getMyReports, getAllReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Instructor', 'Admin'), createReport);
router.get('/my-reports', protect, authorize('Student'), getMyReports);
router.get('/', protect, authorize('Admin'), getAllReports);

module.exports = router;
