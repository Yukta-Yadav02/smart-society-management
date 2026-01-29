const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("db connected "))
    .catch((error)=>{
        console.log("db error:", error.message);
        process.exit(1);
    });
}

