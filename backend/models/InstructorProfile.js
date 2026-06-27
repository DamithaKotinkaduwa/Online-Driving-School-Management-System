const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String },
  licenseTypes: [{ type: String }], // Array of strings like ['Car', 'Truck']
  experience: { type: Number }, // Years of experience
  rating: { type: Number, default: 0 }, // Average rating calculated from lesson reports
}, {
  timestamps: true
});

module.exports = mongoose.model('InstructorProfile', instructorProfileSchema);
