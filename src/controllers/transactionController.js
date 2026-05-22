const Transaction = require('../models/Transaction');
const ActivityLog = require('../models/ActivityLog');
const { analyzeTransaction } = require('../ai/fraudDetector');

exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, recipient, type, description } = req.body;

    const riskResult = await analyzeTransaction({
      userId: req.user._id,
      amount,
      recipient,
      type,
    });

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      recipient,
      type,
      description,
      riskScore: riskResult.score,
      flagged: riskResult.flagged,
      flagReasons: riskResult.reasons,
      status: riskResult.flagged ? 'blocked' : 'completed',
    });

    await ActivityLog.create({
      user: req.user._id,
      event: riskResult.flagged ? 'TRANSACTION_BLOCKED' : 'TRANSACTION_CREATED',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      meta: { transactionId: transaction._id, amount, riskScore: riskResult.score },
    });

    res.status(201).json({
      success: true,
      transaction,
      alert: riskResult.flagged ? 'Transaction flagged for suspicious activity' : null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    next(error);
  }
};