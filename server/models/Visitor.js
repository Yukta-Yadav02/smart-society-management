// models/Visitor.js
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },

    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // SECURITY
      required: true,
    },

    entryTime: {
      type: Date,
      default: Date.now,
    },

    exitTime: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);