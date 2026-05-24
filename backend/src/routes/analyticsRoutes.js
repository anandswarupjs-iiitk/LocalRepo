const express = require("express");

const router = express.Router();

const protect =
require("../middleware/authMiddleware");

const {

    getExpenseAnalytics,
    getMonthlyReport,
    getCategoryInsights,
    getTrends

}

=

require("../controllers/analyticsController");


router.get(

    "/expenses",

    protect,

    getExpenseAnalytics

);


router.get(

    "/monthly",

    protect,

    getMonthlyReport

);


router.get(

    "/categories",

    protect,

    getCategoryInsights

);


router.get(

    "/trends",

    protect,

    getTrends

);


module.exports = router;