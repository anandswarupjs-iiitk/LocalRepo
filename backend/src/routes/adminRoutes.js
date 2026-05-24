const express =
require("express");

const router =
express.Router();

const protect =
require("../middleware/authMiddleware");

const adminOnly =
require("../middleware/adminMiddleware");

const {

    getUsers,

    getAllTransactions,

    getFraudReports

}

=

require(

"../controllers/adminController"

);


router.get(

    "/users",

    protect,

    adminOnly,

    getUsers

);


router.get(

    "/transactions",

    protect,

    adminOnly,

    getAllTransactions

);


router.get(

    "/fraud-reports",

    protect,

    adminOnly,

    getFraudReports

);


module.exports =
router;