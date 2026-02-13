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

    // [OWNERSHIP FLOW] - Flat ka malik kaun hai (Owner/Admin)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // [OWNERSHIP FLOW] - Flat me rehne wala kaun hai (Tenant/Owner khud)
    currentResident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resident: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: String,
      email: String
    },
    kitchen: {
      type: String,
      default: "1"
    },
  },
  { timestamps: true }
);

//  same wing me same flat duplicate na ho
flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });



// FIX IS HERE
module.exports = mongoose.models.Flat || mongoose.model("Flat", flatSchema);