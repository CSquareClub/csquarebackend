const mongoose = require('mongoose');

const toastSchema = new mongoose.Schema({
  link: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  photo: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Toast', toastSchema);
