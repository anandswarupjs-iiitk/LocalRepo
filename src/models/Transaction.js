const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:      { type: Number, required: true },
  recipient:   { type: String, required: true },
  type:        { type: String, enum: ['debit', 'credit', 'transfer'], required: true },
  description: { type: String, maxlength: 200 },
  riskScore:   { type: Number, default: 0 },
  flagged:     { type: Boolean, default: false },
  flagReasons: [String],
  status:      { type: String, enum: ['pending', 'completed', 'blocked'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);