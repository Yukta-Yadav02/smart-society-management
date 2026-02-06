const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "RESIDENT", "SECURITY"],
      default: "RESIDENT", // public bhi resident hi hai (pending)
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED"],
      default: "PENDING",
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      default: null,
    },
    
    residentType: {
      type: String,
      enum: ["OWNER", "TENANT"],
      default: "OWNER",
    },
    
    isActive: {
     type: Boolean,
     default: true,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);