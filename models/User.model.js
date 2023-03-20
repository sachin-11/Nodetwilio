const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  code: {
    type: Number,
  },
  phone: {
    type: Number,
  },
  otpExpiry: {
    type: Date,
    default: Date.now()
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);