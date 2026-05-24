const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:[2,"Name too short"]
    },

    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,

        match:[
            /^\S+@\S+\.\S+$/,
            "Please enter a valid email"
        ]
    },

    password:{
        type:String,
        required:[true,"Password required"],
        minlength:[6,"Password must contain at least 6 characters"]
    },

    twoFactorEnabled: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: [
            "user",
            "admin"
        ],
        default: "user"
    },

    phone: {
        type: String,
        default: ""
    }

},
{
    timestamps:true
}
);

module.exports=mongoose.model(
"User",
userSchema
);