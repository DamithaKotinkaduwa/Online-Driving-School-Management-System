const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  updateBookingStatus 
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Student', 'Admin'), createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, authorize('Admin'), getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
