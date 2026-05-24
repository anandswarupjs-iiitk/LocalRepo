const Transaction = require("../models/Transaction");

// Total spent (sum of all outgoing transactions)
const getBalance = async (req, res, next) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { sender: req.user._id } },
            { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
        ]);

        const totalSpent = result.length > 0 ? result[0].totalSpent : 0;

        res.json({ totalSpent });

    } catch (error) {
        next(error);
    }
};

// Fraud summary
const getFraudSummary = async (req, res, next) => {
    try {
        const [fraudCount, totalTransactions] = await Promise.all([
            Transaction.countDocuments({ sender: req.user._id, fraudFlag: true }),
            Transaction.countDocuments({ sender: req.user._id })
        ]);

        res.json({
            fraudTransactions: fraudCount,
            totalTransactions
        });

    } catch (error) {
        next(error);
    }
};

// Recent transactions
const getRecentTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ sender: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("receiver", "name email");

        res.json(transactions);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBalance,
    getFraudSummary,
    getRecentTransactions
};
