const User =
require("../models/User");

const Transaction =
require("../models/Transaction");

const FraudLog =
require("../models/FraudLog");


// User monitoring
const getUsers =
async(req,res,next)=>{

    try{

        const users =
        await User.find()

        .select("-password");


        res.json(users);

    }

    catch(error){

        next(error);

    }

};


// Transaction monitoring
const getAllTransactions =
async(req,res,next)=>{

    try{

        const transactions =

        await Transaction.find()

        .populate(
            "sender",
            "name email"
        )

        .populate(
            "receiver",
            "name email"
        )

        .sort({

            createdAt:-1

        });


        res.json(
            transactions
        );

    }

    catch(error){

        next(error);

    }

};


// Fraud reports
const getFraudReports =
async(req,res,next)=>{

    try{

        const reports =

        await FraudLog.find()

        .populate(
            "user",
            "name email"
        )

        .sort({

            createdAt:-1

        });


        res.json(
            reports
        );

    }

    catch(error){

        next(error);

    }

};


module.exports={

    getUsers,

    getAllTransactions,

    getFraudReports

};