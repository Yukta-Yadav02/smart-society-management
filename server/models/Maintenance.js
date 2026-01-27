// models/Maintenance.js
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },

    month: {
      type: String,
      required: true,
      enum: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
    },

    year: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    paidAt: Date,

    paidBy: {
     type: mongoose.Schema.Types.ObjectId,
        ref: "User",
},
  },
  
  { timestamps: true }
);

//  prevent duplicate maintenance for same flat + month + year
maintenanceSchema.index({ flat: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);