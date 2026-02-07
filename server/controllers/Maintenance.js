const Maintenance = require("../models/Maintenance");
const Flat = require("../models/Flat");
const User = require("../models/User");

/* ================= ADMIN ================= */

// ADMIN → create maintenance for one or more flats (special/custom)
exports.createMaintenance = async (req, res) => {
  try {
    console.log("Creating maintenance - Request body:", req.body);
    const { title, amount, month, year, flat, description, type, period } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const cleanPeriod = period || `${month || ""} ${year || ""}`.trim();

    // 1. Determine targets (which flats)
    let targetFlats = [];
    if (flat === "ALL") {
      targetFlats = await Flat.find();
    } else if (Array.isArray(flat)) {
      targetFlats = await Flat.find({ _id: { $in: flat } });
    } else if (flat) {
      const singleFlat = await Flat.findById(flat);
      if (singleFlat) targetFlats = [singleFlat];
    }

    if (targetFlats.length === 0) {
      return res.status(404).json({ success: false, message: "No valid flats selected" });
    }

    // 2. Prepare records
    const recordsToCreate = targetFlats.map(f => ({
      title: title || (type === "Special" ? "Special Charge" : "Maintenance"),
      amount: Number(amount),
      month,
      year,
      period: cleanPeriod,
      flat: f._id,
      description: description || "",
      type: type || "Common",
      status: "UNPAID",
      createdBy: req.user.id,
    }));

    // 3. Save
    let result;
    try {
      if (recordsToCreate.length === 1) {
        result = await Maintenance.create(recordsToCreate[0]);
      } else {
        result = await Maintenance.insertMany(recordsToCreate);
      }

      console.log(`Successfully created ${recordsToCreate.length} maintenance record(s)`);

      res.status(201).json({
        success: true,
        message: `${recordsToCreate.length} maintenance record(s) created`,
        data: result,
      });
    } catch (saveError) {
      console.error("Database save error:", saveError);
      return res.status(400).json({
        success: false,
        message: saveError.message || "Validation failed",
        error: saveError
      });
    }
  } catch (error) {
    console.error("Create maintenance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create maintenance",
      error: error.message
    });
  }
};

// ADMIN → generate common maintenance for all flats
exports.generateCommonMaintenance = async (req, res) => {
  try {
    console.log("Generating common maintenance - Request body:", req.body);

    const { amount, period } = req.body;
    const cleanPeriod = period ? period.trim() : null;

    if (!amount || !cleanPeriod) {
      return res.status(400).json({
        success: false,
        message: "Amount and period are required",
      });
    }

    const flats = await Flat.find();
    console.log(`Found ${flats.length} flats for maintenance generation`);

    // 1. Identify which flats already have maintenance for this period/type
    const existingRecords = await Maintenance.find({
      period: cleanPeriod,
      type: "Common",
      flat: { $in: flats.map(f => f._id) }
    });

    const existingFlatIds = new Set(existingRecords.map(r => r.flat ? r.flat.toString() : null));

    // 2. Filter out flats that already have maintenance
    const recordsToCreate = flats
      .filter(flat => !existingFlatIds.has(flat._id.toString()))
      .map((flat) => ({
        title: "Monthly Maintenance",
        flat: flat._id,
        amount: Number(amount),
        period: cleanPeriod,
        type: "Common",
        status: "UNPAID",
        createdBy: req.user.id,
      }));

    if (recordsToCreate.length === 0) {
      return res.status(200).json({
        success: true,
        message: `Maintenance for ${cleanPeriod} already generated for selected flats.`,
        data: [],
      });
    }

    // 3. Insert new records
    const saved = await Maintenance.insertMany(recordsToCreate);
    console.log(`Generated ${saved.length} new records. Skipped ${existingFlatIds.size} existing.`);

    res.status(201).json({
      success: true,
      message: `Generated: ${saved.length}. Skipped: ${existingFlatIds.size}.`,
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
      .populate({
        path: "flat",
        // NEW COMMENT: Added ownerName and isOccupied to the populated data so we can see it on the screen
        select: "flatNumber wing isOccupied ownerName",
        populate: {
          path: "wing",
          select: "name"
        }
      })
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

// NEW FUNCTION: ADMIN → Manual status toggle (Mark as Paid/Unpaid)
// This allows Admin to manually mark a bill as paid if the resident paid in cash.
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'PAID' or 'UNPAID'
    const maintenanceId = req.params.id;

    if (!['PAID', 'UNPAID'].includes(status.toUpperCase())) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const maintenance = await Maintenance.findById(maintenanceId);
    if (!maintenance) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    maintenance.status = status.toUpperCase();

    // If marking as paid, set the paidBy as current admin and set current date
    if (maintenance.status === 'PAID') {
      maintenance.paidBy = req.user.id;
      maintenance.paidAt = new Date();
    } else {
      maintenance.paidBy = undefined;
      maintenance.paidAt = undefined;
    }

    await maintenance.save();

    res.status(200).json({
      success: true,
      message: `Maintenance marked as ${maintenance.status}`,
      data: maintenance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Status update failed", error: error.message });
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
  })
    .populate({
      path: "flat",
      select: "flatNumber wing",
      populate: {
        path: "wing",
        select: "name"
      }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: maintenance,
  });
};

// RESIDENT → fake payment
exports.payMaintenance = async (req, res) => {
  try {
    console.log('Payment request received for ID:', req.params.id);

    const maintenance = await Maintenance.findById(req.params.id).populate({
      path: 'flat',
      select: 'flatNumber wing',
      populate: { path: 'wing', select: 'name' }
    });
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
