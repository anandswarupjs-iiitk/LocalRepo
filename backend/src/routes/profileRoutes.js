const express =
require("express");

const router =
express.Router();

const protect =
require("../middleware/authMiddleware");

const {

    getProfile,
    updateProfile,
    changePassword,
    update2FA

}

=

require(
"../controllers/profileController"
);


router.get(

    "/",

    protect,

    getProfile

);


router.put(

    "/",

    protect,

    updateProfile

);


router.put(

    "/password",

    protect,

    changePassword

);


router.put(

    "/2fa",

    protect,

    update2FA

);


module.exports =
router;