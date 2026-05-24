const Notification =
require("../models/Notification");


const createNotification =
async(

    io,

    userId,

    type,

    message

)=>{

    const notification =

    await Notification.create({

        user: userId,

        type,

        message

    });


    io.emit(

        "notification",

        notification

    );


    return notification;

};


module.exports =
createNotification;