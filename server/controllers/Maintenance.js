// controllers/maintenance.js
const Maintenance = require("../models/Maintenance");
const Flat = require("../models/Flat");
const User = require("../models/User");

/* ================= ADMIN ================= */

// ADMIN → create maintenance for ALL flats
exports.createMaintenance = async (req, res) => {
  const { title, amount, month, year, flat } = req.body;

  if (!title || !amount) {
    return res.status(400).json({
      success: false,
      message: "Title and amount required",
    });
  }

  if (flat) {
    const exists = await Flat.findById(flat);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }
  }

  const maintenance = await Maintenance.create({
    title,
    amount,
    month,
    year,
    flat: flat || null,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: maintenance,
  });
};

// ADMIN → get all maintenance
exports.getAllMaintenance = async (req, res) => {
  try {
    const data = await Maintenance.find()
      .populate("flat", "flatNumber")
      .populate("paidBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= RESIDENT ================= */

// RESIDENT → my maintenance
exports.getMyMaintenance = async (req, res) => {
  const user = await User.findById(req.user.id).select("flat");

  const maintenance = await Maintenance.find({
    $or: [
      { flat: null },       // society-wide
      { flat: user.flat },  // my flat
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: maintenance,
  });
};


// RESIDENT → fake payment
exports.payMaintenance = async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id);
  const user = await User.findById(req.user.id).select("flat");

  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: "Maintenance not found",
    });
  }

  // check ownership
  if (
    maintenance.flat &&
    maintenance.flat.toString() !== user.flat.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (maintenance.status === "PAID") {
    return res.status(400).json({
      success: false,
      message: "Already paid",
    });
  }

  maintenance.status = "PAID";
  maintenance.paidBy = req.user.id;
  maintenance.paidAt = new Date();

  await maintenance.save();

  res.status(200).json({
    success: true,
    message: "Payment successful",
  });
};

