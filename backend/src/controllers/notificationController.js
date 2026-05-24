const Notification =
require("../models/Notification");


// Get notifications
const getNotifications =
async(req,res,next)=>{

try{

const notifications=

await Notification.find({

user:req.user._id

})

.sort({

createdAt:-1

});


res.json(
notifications
);

}

catch(error){

next(error);

}

};


module.exports={

getNotifications

};