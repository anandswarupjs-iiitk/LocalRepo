const Transaction = require("../models/Transaction");
const FraudLog = require("../models/FraudLog");
const calculateRisk = require("../ai/fraudService"); // fixed: moved to top level
const generateConfidence = require("../ai/confidenceEngine");
const createNotification = require("../ai/notificationService");

// Create transaction
const createTransaction = async (req, res, next) => {
    try {
        const { amount, receiver, merchant } = req.body;

        // Input validation
        if (!amount || !receiver) {
            return res.status(400).json({
                message: "Amount and receiver are required"
            });
        }

        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be a positive number"
            });
        }

        const fraudResult = await calculateRisk(
            req.user._id,
            amount,
            receiver
        );

        const confidenceResult = generateConfidence(
            fraudResult
        );

        const transaction = await Transaction.create({
            amount,
            merchant,
            sender: req.user._id,
            receiver,
            fraudFlag: fraudResult.fraudFlag,
            riskScore: fraudResult.riskScore,
            riskLevel: fraudResult.riskLevel,
            riskPercentage: fraudResult.riskPercentage,

            confidence: confidenceResult.confidencePercentage,

            recommendation: confidenceResult.recommendation
        });

        const io = req.app.get("io");

        await createNotification(

            io,

            req.user._id,

            "ACTIVITY",

            `Transaction of ₹${amount} created`

        );

        io.emit("transactionCreated", transaction);

        if (fraudResult.riskScore >= 50) {
            await FraudLog.create({
                transaction: transaction._id,
                user: req.user._id,
                riskScore: fraudResult.riskScore,
                riskLevel: fraudResult.riskLevel,
                reasons: fraudResult.reasons
            });

            io.emit("fraudAlert", {
                message: "Suspicious transaction detected",
                riskScore: fraudResult.riskScore,
                riskLevel: fraudResult.riskLevel,
                transaction
            });

            await createNotification(

                io,
                        
                req.user._id,
                        
                "FRAUD",
                        
                "Suspicious transaction detected"
                        
            );
        }

        res.status(201).json(transaction);

    } catch (error) {
        next(error);
    }
};

// Fetch transactions
const getTransactions = async (req, res, next) => {
    try {
        const {
            merchant,
            status,
            minAmount,
            maxAmount,
            startDate,
            endDate
        } = req.query;

        let filter = { sender: req.user._id };

        if (merchant) {
            filter.merchant = { $regex: merchant, $options: "i" };
        }

        if (status) {
            filter.status = status;
        }

        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = Number(minAmount);
            if (maxAmount) filter.amount.$lte = Number(maxAmount);
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(filter)
            .populate("receiver", "name email")
            .sort({ createdAt: -1 });

        res.json(transactions);

    } catch (error) {
        next(error);
    }
};

// Update status (owner only)
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        // Ownership check
        if (transaction.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorised to update this transaction"
            });
        }

        if (req.body.status) {
            transaction.status = req.body.status;
        }

        const updated = await transaction.save();
        res.json(updated);

    } catch (error) {
        next(error);
    }
};

// Delete transaction (owner only)
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        // Ownership check
        if (transaction.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorised to delete this transaction"
            });
        }

        await transaction.deleteOne();

        res.json({ message: "Transaction deleted" });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};
