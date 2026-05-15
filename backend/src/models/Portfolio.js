const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  hero:       { type: mongoose.Schema.Types.Mixed, required: true },
  about:      { type: mongoose.Schema.Types.Mixed, required: true },
  skills:     { type: [mongoose.Schema.Types.Mixed], required: true },
  experience: { type: [mongoose.Schema.Types.Mixed], required: true },
  education:  { type: [mongoose.Schema.Types.Mixed], required: true },
  contact:    { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
