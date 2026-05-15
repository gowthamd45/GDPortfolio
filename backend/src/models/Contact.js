const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, default: null },
  subject:    { type: String, required: true },
  message:    { type: String, required: true },
  ip_address: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Contact', contactSchema);
