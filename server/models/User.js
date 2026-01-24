const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
     role:{
      type: String,
      enum: ["Admin", "Resident", "Security"],
      default: "Resident",
    },

})


module.exports = mongoose.model("User",userSchema);