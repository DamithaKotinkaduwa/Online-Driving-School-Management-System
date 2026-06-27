const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true },   // e.g. "17:00"
  isBooked: { type: Boolean, default: false } // Note: Usually availability defines a range, and actual slots are generated/checked dynamically, but keeping this per the requirements. Or maybe this defines a specific 1-hour slot.
}, {
  timestamps: true
});

module.exports = mongoose.model('Availability', availabilitySchema);
