const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    wing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wing",
      required: true,
    },

    flatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    isOccupied: {
      type: Boolean,
      default: false,
    },

    currentResident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

//  same wing me same flat duplicate na ho
flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });



// FIX IS HERE
module.exports = mongoose.models.Flat || mongoose.model("Flat", flatSchema);