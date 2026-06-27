const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const User = require('../models/User');

const createBooking = async (req, res) => {
  try {
    const { instructorId, date, time } = req.body;
    
    // Check if slot is available (simplified, could be cross-checked with Availability)
    const existingBooking = await Booking.findOne({ instructorId, date, time, status: { $in: ['Pending', 'Confirmed'] } });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }
    
    const booking = await Booking.create({
      studentId: req.user._id,
      instructorId,
      date,
      time
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'Student') {
      bookings = await Booking.find({ studentId: req.user._id }).populate('instructorId', 'name email');
    } else if (req.user.role === 'Instructor') {
      bookings = await Booking.find({ instructorId: req.user._id }).populate('studentId', 'name email');
    } else {
      // Admin gets all
      bookings = await Booking.find().populate('studentId', 'name').populate('instructorId', 'name');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('studentId', 'name email').populate('instructorId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // If student, they can only cancel
    if (req.user.role === 'Student' && status !== 'Cancelled') {
      return res.status(403).json({ message: 'Students can only cancel bookings' });
    }
    
    // If instructor, they can confirm, complete, cancel, no-show
    if (req.user.role === 'Instructor' && req.user._id.toString() !== booking.instructorId.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
};
