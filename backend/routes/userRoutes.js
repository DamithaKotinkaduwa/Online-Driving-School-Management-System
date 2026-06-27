const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin'), getUsers);
router.get('/:id', protect, authorize('Admin'), getUserById);
router.put('/:id/status', protect, authorize('Admin'), updateUserStatus);

module.exports = router;
