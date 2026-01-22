const mongoose = require('mongoose');

exports.connect = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then("db connected successfully")
    .catch("db error ");
}

