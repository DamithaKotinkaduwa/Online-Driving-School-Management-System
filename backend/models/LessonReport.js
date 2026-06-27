const mongoose = require('mongoose');

const lessonReportSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('LessonReport', lessonReportSchema);
