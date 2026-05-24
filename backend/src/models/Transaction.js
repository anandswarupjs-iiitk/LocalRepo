const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
{
    amount: {
        type: Number,
        required: [true, "Transaction amount required"],
        min: [1, "Amount must be greater than 0"]
    },

    merchant: {
    type: String,
    trim: true,
    default: "Unknown"
    },
    
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender required"]
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver required"]
    },

    status: {
        type: String,

        enum: {
            values: [
                "pending",
                "completed",
                "failed",
                "flagged"
            ],

            message: "Invalid transaction status"
        },

        default: "pending"
    },

    fraudFlag: {
        type: Boolean,
        default: false
    },

    riskScore: {
        type: Number,
        min: [0, "Risk score cannot be negative"],
        max: [100, "Risk score cannot exceed 100"],
        default: 0
    },

    riskLevel:{

        type:String,
        
        enum:[
            "LOW",
            "MEDIUM",
            "HIGH"
        ],
    
        default:"LOW"
    
    },
    
    riskPercentage:{
    
        type:String,
    
        default:"0%"
    
    },

},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);