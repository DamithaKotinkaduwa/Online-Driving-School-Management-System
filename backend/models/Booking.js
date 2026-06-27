const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }, // Optional based on how availability is implemented
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g. "09:00 - 10:00"
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show'], default: 'Pending' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
