const express = require('express');
const router = express.Router();
const { 
  getInstructors, 
  getInstructorProfile, 
  updateInstructorProfile,
  getAvailability,
  addAvailability,
  removeAvailability
} = require('../controllers/instructorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getInstructors);
router.get('/:id', getInstructorProfile);
router.put('/:id', protect, updateInstructorProfile);
router.get('/:id/availability', getAvailability);
router.post('/:id/availability', protect, addAvailability);
router.delete('/:id/availability/:slotId', protect, removeAvailability);

module.exports = router;
