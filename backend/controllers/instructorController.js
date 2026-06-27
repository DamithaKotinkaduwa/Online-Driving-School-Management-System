const InstructorProfile = require('../models/InstructorProfile');
const User = require('../models/User');
const Availability = require('../models/Availability');

const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'Instructor', isActive: true }).select('-password');
    // Also fetch their profiles
    const profiles = await InstructorProfile.find();
    
    const instructorData = instructors.map(instructor => {
      const profile = profiles.find(p => p.userId.toString() === instructor._id.toString());
      return {
        ...instructor._doc,
        profile
      };
    });
    
    res.json(instructorData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInstructorProfile = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id).select('-password');
    if (instructor && instructor.role === 'Instructor') {
      const profile = await InstructorProfile.findOne({ userId: req.params.id });
      res.json({
        ...instructor._doc,
        profile
      });
    } else {
      res.status(404).json({ message: 'Instructor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInstructorProfile = async (req, res) => {
  try {
    // Only the instructor themselves or an Admin can update
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'Admin') {
       return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { bio, licenseTypes, experience } = req.body;
    let profile = await InstructorProfile.findOne({ userId: req.params.id });
    
    if (profile) {
      profile.bio = bio || profile.bio;
      profile.licenseTypes = licenseTypes || profile.licenseTypes;
      profile.experience = experience || profile.experience;
      
      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      // Create if it doesn't exist
      profile = await InstructorProfile.create({
        userId: req.params.id,
        bio,
        licenseTypes,
        experience
      });
      res.status(201).json(profile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({ instructorId: req.params.id });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAvailability = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'Admin') {
       return res.status(403).json({ message: 'Not authorized to add availability' });
    }
    
    const { dayOfWeek, startTime, endTime } = req.body;
    
    const slot = await Availability.create({
      instructorId: req.params.id,
      dayOfWeek,
      startTime,
      endTime
    });
    
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeAvailability = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.slotId);
    
    if (slot) {
      if (req.user._id.toString() !== slot.instructorId.toString() && req.user.role !== 'Admin') {
         return res.status(403).json({ message: 'Not authorized to remove availability' });
      }
      
      await Availability.findByIdAndDelete(req.params.slotId);
      res.json({ message: 'Availability removed' });
    } else {
      res.status(404).json({ message: 'Slot not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInstructors,
  getInstructorProfile,
  updateInstructorProfile,
  getAvailability,
  addAvailability,
  removeAvailability
};
