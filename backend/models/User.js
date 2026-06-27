const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Instructor', 'Student'], required: true },
  phone: { type: String },
  photo: { type: String }, // URL or path
  licenseType: { type: String }, // for students, e.g., 'Car', 'Motorcycle'
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
