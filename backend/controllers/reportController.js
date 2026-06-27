const LessonReport = require('../models/LessonReport');
const Booking = require('../models/Booking');

// Instructor creates a report
const createReport = async (req, res) => {
  try {
    const { bookingId, rating, notes } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const report = await LessonReport.create({
      bookingId,
      instructorId: req.user._id,
      studentId: booking.studentId,
      rating,
      notes
    });
    
    // Also mark booking as completed
    booking.status = 'Completed';
    await booking.save();
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student views their reports
const getMyReports = async (req, res) => {
  try {
    const reports = await LessonReport.find({ studentId: req.user._id }).populate('instructorId', 'name').populate('bookingId', 'date time');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports (Admin)
const getAllReports = async (req, res) => {
  try {
    const reports = await LessonReport.find().populate('studentId', 'name').populate('instructorId', 'name');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getMyReports,
  getAllReports
};
