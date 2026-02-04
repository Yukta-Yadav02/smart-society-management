const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // null => ALL residents
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      default: null,
    },

    // only for flat notices
    responseStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Notice", noticeSchema);