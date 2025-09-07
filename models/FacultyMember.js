const mongoose = require('mongoose');
const { isValidImageUrl, isValidUrl } = require('../utils/urlValidation');

const facultyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  designation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  department: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  photo: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return isValidImageUrl(v);
      },
      message: 'Photo must be a valid image URL (supports HTTP/HTTPS URLs, data URLs, and CDN links)'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  linkedin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return isValidUrl(v);
      },
      message: 'LinkedIn must be a valid URL'
    }
  },
  specialization: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    trim: true,
    maxlength: 100
  },
  education: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
facultyMemberSchema.index({ isActive: 1, displayOrder: 1 });
facultyMemberSchema.index({ department: 1 });

// Ensure virtual fields are serialized
facultyMemberSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('FacultyMember', facultyMemberSchema);
