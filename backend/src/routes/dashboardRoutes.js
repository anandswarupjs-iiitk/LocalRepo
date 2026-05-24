const express =
require("express");

const router =
express.Router();

const protect =
require("../middleware/authMiddleware");

const {

    getBalance,
    getFraudSummary,
    getRecentTransactions

}

=

require(
"../controllers/dashboardController"
);


router.get(
"/balance",
protect,
getBalance
);


router.get(
"/fraud-summary",
protect,
getFraudSummary
);


router.get(
"/recent",
protect,
getRecentTransactions
);


module.exports=
router;