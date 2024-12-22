const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, enum: ['facebook', 'google', 'manual'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);