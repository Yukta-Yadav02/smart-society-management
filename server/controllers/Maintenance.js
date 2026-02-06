const Maintenance = require("../models/Maintenance");
const Flat = require("../models/Flat");
const User = require("../models/User");

/* ================= ADMIN ================= */

// ADMIN → create maintenance for a single flat (special)
exports.createMaintenance = async (req, res) => {
  try {
    console.log("Creating maintenance - Request body:", req.body);
    console.log("User ID:", req.user?.id);
    
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { title, amount, month, year, flat, description, type } = req.body;

    if (!title && type !== "Special") {
      return res.status(400).json({
        success: false,
        message: "Title required",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount required",
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
      title: title || "Maintenance",
      amount,
      month,
      year,
      period: req.body.period || `${month || ""} ${year || ""}`,
      flat: flat || null,
      description: description || "",
      type: type || "Common",
      status: "UNPAID",
      createdBy: req.user.id,
    });

    console.log("Maintenance created successfully:", maintenance._id);

    res.status(201).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    console.error("Create maintenance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create maintenance",
      error: error.message
    });
  }
};

// ADMIN → generate common maintenance for all flats
exports.generateCommonMaintenance = async (req, res) => {
  try {
    console.log("Generating common maintenance - Request body:", req.body);
    
    const { amount, period } = req.body;

    if (!amount || !period) {
      return res.status(400).json({
        success: false,
        message: "Amount and period are required",
      });
    }

    const flats = await Flat.find();
    console.log(`Found ${flats.length} flats for maintenance generation`);

    if (flats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No flats found. Please create flats first.",
      });
    }

    const records = flats.map((flat) => ({
      title: "Monthly Maintenance",
      flat: flat._id,
      amount,
      period,
      type: "Common",
      status: "UNPAID",
      createdBy: req.user.id,
    }));

    const saved = await Maintenance.insertMany(records);
    console.log(`Generated ${saved.length} maintenance records`);

    res.status(201).json({
      success: true,
      message: `Generated maintenance for ${saved.length} flats`,
      data: saved,
    });
  } catch (error) {
    console.error("Generate common maintenance error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate common maintenance",
      error: error.message
    });
  }
};

// ADMIN → get all maintenance
exports.getAllMaintenance = async (req, res) => {
  try {
    console.log("Fetching all maintenance records...");
    
    const data = await Maintenance.find()
      .populate("flat", "flatNumber")
      .populate("paidBy", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    console.log(`Found ${data.length} maintenance records`);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get all maintenance error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      count: 0,
      data: []
    });
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
  try {
    console.log('Payment request received for ID:', req.params.id);
    
    const maintenance = await Maintenance.findById(req.params.id).populate('flat', 'flatNumber wing');
    const user = await User.findById(req.user.id).select("flat name").populate('flat', 'flatNumber wing');

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance not found",
      });
    }

    if (maintenance.flat && maintenance.flat._id.toString() !== user.flat._id.toString()) {
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

    // Log payment success for admin notification
    const flatNumber = maintenance.flat?.flatNumber || user.flat?.flatNumber || 'Unknown';
    const residentName = user.name || 'Resident';
    const amount = maintenance.amount;
    const period = maintenance.period || 'Current';
    
    console.log(`🎉 PAYMENT SUCCESS NOTIFICATION:`);
    console.log(`   Flat: ${flatNumber}`);
    console.log(`   Resident: ${residentName}`);
    console.log(`   Amount: ₹${amount}`);
    console.log(`   Period: ${period}`);
    console.log(`   Time: ${new Date().toLocaleString()}`);
    console.log(`   Status: PAYMENT SUCCESSFUL ✅`);

    res.status(200).json({
      success: true,
      message: `Payment of ₹${amount} successful! Admin has been notified.`,
      data: maintenance,
      notification: {
        flat: flatNumber,
        resident: residentName,
        amount: amount,
        period: period,
        status: "PAYMENT_SUCCESS"
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message
    });
  }
};

// ADMIN → delete maintenance
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found"
      });
    }

    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Maintenance record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete maintenance record",
      error: error.message
    });
  }
};
