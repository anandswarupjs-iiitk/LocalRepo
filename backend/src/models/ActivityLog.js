const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event:     { type: String, required: true },
  ip:        String,
  userAgent: String,
  meta:      { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);