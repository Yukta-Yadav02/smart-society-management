// models/FlatRequest.js
const mongoose = require("mongoose");

const flatRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },

    ownershipType: {
      type: String,
      enum: ["OWNER", "RESIDENT"],
      required: true,
    },

    remark: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    residentOpinion: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },

    decidedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlatRequest", flatRequestSchema);