const Transaction = require("../models/Transaction");


// Expense analytics
const getExpenseAnalytics = async (req, res, next) => {

    try {

        const analytics = await Transaction.aggregate([

            {
                $match: {

                    sender: req.user._id

                }
            },

            {
                $group: {

                    _id: null,

                    totalExpense: {

                        $sum: "$amount"

                    },

                    transactionCount: {

                        $sum: 1

                    }

                }
            }

        ]);


        res.json(

            analytics[0] || {

                totalExpense: 0,

                transactionCount: 0

            }

        );

    }

    catch (error) {

        next(error);

    }

};


// Monthly report
const getMonthlyReport = async (req, res, next) => {

    try {

        const report = await Transaction.aggregate([

            {
                $match: {

                    sender: req.user._id

                }
            },

            {
                $group: {

                    _id: {

                        month: {

                            $month: "$createdAt"

                        }

                    },

                    totalAmount: {

                        $sum: "$amount"

                    }

                }

            },

            {
                $sort: {

                    "_id.month": 1

                }
            }

        ]);


        res.json(report);

    }

    catch (error) {

        next(error);

    }

};


// Category insights
const getCategoryInsights = async (req, res, next) => {

    try {

        const insights = await Transaction.aggregate([

            {
                $match: {

                    sender: req.user._id

                }
            },

            {
                $group: {

                    _id: "$merchant",

                    totalAmount: {

                        $sum: "$amount"

                    },

                    count: {

                        $sum: 1

                    }

                }

            }

        ]);


        res.json(insights);

    }

    catch (error) {

        next(error);

    }

};


// Trend analysis
const getTrends = async (req, res, next) => {

    try {

        const trends = await Transaction.find({

            sender: req.user._id

        })

        .sort({

            createdAt: -1

        })

        .limit(10);


        res.json(trends);

    }

    catch (error) {

        next(error);

    }

};


module.exports = {

    getExpenseAnalytics,
    getMonthlyReport,
    getCategoryInsights,
    getTrends

};