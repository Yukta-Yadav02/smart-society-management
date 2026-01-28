// controllers/maintenance.js
const Maintenance = require("../models/Maintenance");
const Flat = require("../models/FLat");
const User = require("../models/User");

// Admin creates maintenance
exports.createMaintenance = async (req, res) => {
  try {
    const { flatId, month, year, amount } = req.body;

    if (!flatId || !month || !year || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Flat + resident fetch
    const flat = await Flat.findById(flatId).populate("currentResident");
    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    //  Flat must be occupied
    if (!flat.currentResident) {
      return res.status(400).json({
        success: false,
        message: "Flat is not occupied, maintenance not applicable",
      });
    }

    //  Resident must be ACTIVE
    if (flat.currentResident.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Resident account is not active, maintenance not applicable",
      });
    }

    //  Create maintenance
    const maintenance = await Maintenance.create({
      flat: flatId,
      month,
      year,
      amount,
    });

    console.log(maintenance);

    res.status(201).json({
      success: true,
      message: "Maintenance created successfully",
      data: maintenance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Maintenance already exists for this month",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create maintenance",
      error: error.message,
    });
  }
};

exports.getMyMaintenance = async (req, res) => {
  try {
    const { month, year } = req.query;

    const user = await User.findById(req.user.id).select("flat");

    if (!user || !user.flat) {
      return res.status(403).json({
        success: false,
        message: "Flat not assigned",
      });
    }

    const filter = { flat: user.flat };
    if (month) filter.month = month;
    if (year) filter.year = year;

    const maintenance = await Maintenance.find(filter).sort({
      year: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance",
    });
  }
};

exports.payMaintenance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("flat");

    if (!user || !user.flat) {
      return res.status(403).json({
        success: false,
        message: "Flat not assigned",
      });
    }

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance not found",
      });
    }

    //  SAFETY CHECK
    if (!maintenance.flat) {
      return res.status(400).json({
        success: false,
        message: "Invalid maintenance record (flat missing)",
      });
    }

    if (maintenance.flat.toString() !== user.flat.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can pay only your flat's maintenance",
      });
    }

    if (maintenance.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Already paid",
      });
    }

    maintenance.status = "PAID";
    maintenance.paidAt = new Date();

    await maintenance.save();

    res.status(200).json({
      success: true,
      message: "Maintenance paid successfully",
    });
  } catch (error) {
    console.error("PAYMENT ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};