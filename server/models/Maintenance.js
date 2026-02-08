// models/Maintenance.js
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    month: String,
    year: Number,
    period: String,
    description: String,

    // null = ALL flats
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      default: null,
    },

    type: {
      type: String,
      enum: ["Common", "Special"],
      default: "Common",
    },

    status: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paidAt: Date,
    paymentMode: {
      type: String,
      enum: ["CASH", "ONLINE"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Maintenance", maintenanceSchema);
