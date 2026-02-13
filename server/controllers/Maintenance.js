const Maintenance = require("../models/Maintenance");
const Flat = require("../models/Flat");
const User = require("../models/User");

// Helper to extract month/year from a period string (e.g., "July 2026")
const parsePeriod = (period) => {
  if (!period) return { month: null, year: null };
  const parts = period.split(/\s+/);
  let month = null;
  let year = null;

  parts.forEach(part => {
    if (/^\d{4}$/.test(part)) {
      year = parseInt(part);
    } else if (/^[a-zA-Z]+$/.test(part)) {
      month = part;
      
    }
  });

  return { month, year };
};

/* ================= ADMIN ================= */

// ADMIN → create maintenance for one or more flats (special/custom)
exports.createMaintenance = async (req, res) => {
  try {
    console.log("Creating maintenance - Request body:", req.body);
    const { title, amount, month, year, flat, description, type, period, status } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const cleanPeriod = period || `${month || ""} ${year || ""}`.trim();
    const { month: parsedMonth, year: parsedYear } = parsePeriod(cleanPeriod);

    // 1. Determine targets (which flats)
    let targetFlats = [];
    if (flat === "ALL") {
      targetFlats = await Flat.find({ isOccupied: true });
    } else if (Array.isArray(flat)) {
      targetFlats = await Flat.find({ _id: { $in: flat } });
    } else if (flat) {
      const singleFlat = await Flat.findById(flat);
      if (singleFlat) targetFlats = [singleFlat];
    }

    if (targetFlats.length === 0) {
      return res.status(404).json({ success: false, message: "No valid flats selected" });
    }

    // 2. Check for existing records to avoid duplicates
    const existingRecords = await Maintenance.find({
      flat: { $in: targetFlats.map(f => f._id) },
      period: cleanPeriod,
      type: type || "Common"
    });

    const existingFlatIds = new Set(existingRecords.map(r => r.flat.toString()));
    const newTargetFlats = targetFlats.filter(f => !existingFlatIds.has(f._id.toString()));

    if (newTargetFlats.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Maintenance for ${cleanPeriod} already exists for selected flat(s)` 
      });
    }

    // 3. Prepare records for new flats only
    const recordsToCreate = newTargetFlats.map(f => ({
      title: title || (type === "Special" ? "Special Charge" : "Maintenance"),
      amount: Number(amount),
      month: month || parsedMonth,
      year: year || parsedYear,
      period: cleanPeriod,
      flat: f._id,
      description: description || "",
      type: type || "Common",
      status: (status || "UNPAID").toUpperCase(),
      paidBy: (status || "").toUpperCase() === "PAID" ? req.user.id : undefined,
      paidAt: (status || "").toUpperCase() === "PAID" ? new Date() : undefined,
      paymentMode: (status || "").toUpperCase() === "PAID" ? "CASH" : undefined,
      createdBy: req.user.id,
    }));

    // 4. Save
    let result;
    try {
      if (recordsToCreate.length === 1) {
        result = await Maintenance.create(recordsToCreate[0]);
      } else {
        result = await Maintenance.insertMany(recordsToCreate);
      }

      const message = existingFlatIds.size > 0 
        ? `Created ${recordsToCreate.length} record(s). Skipped ${existingFlatIds.size} duplicate(s).`
        : `${recordsToCreate.length} maintenance record(s) created`;

      console.log(message);

      res.status(201).json({
        success: true,
        message,
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

    // Validate year and month - only allow 2026 onwards, and current/future months only
    const { year: parsedYear, month: parsedMonth } = parsePeriod(cleanPeriod);
    const minYear = 2026;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' });
    
    if (parsedYear && parsedYear < minYear) {
      return res.status(400).json({
        success: false,
        message: `Cannot create maintenance for year ${parsedYear}. System starts from ${minYear} onwards.`,
      });
    }

    // If creating for current year, month must be current or future (no past months)
    if (parsedYear && parsedYear === currentYear && parsedMonth) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const parsedMonthIndex = months.findIndex(m => m.toLowerCase() === parsedMonth.toLowerCase());
      const currentMonthIndex = months.findIndex(m => m === currentMonth);
      
      if (parsedMonthIndex !== -1 && parsedMonthIndex < currentMonthIndex) {
        return res.status(400).json({
          success: false,
          message: `Cannot create maintenance for past month. Current month is ${currentMonth} ${currentYear}. You can only create for ${currentMonth} or future months.`,
        });
      }
    }

    // 1. Fetch flats with occupancy info
    const flats = await Flat.find();
    console.log(`Found ${flats.length} total flats`);

    const existingRecords = await Maintenance.find({
      period: cleanPeriod,
      type: "Common",
      flat: { $in: flats.map(f => f._id) }
    });

    const existingFlatIds = new Set(existingRecords.map(r => r.flat ? r.flat.toString() : null));

    // 3. Filter flats based on existing records AND occupancy (if requested)
    const recordsToCreate = flats
      .filter(flat => {
        // Skip if already has record
        if (existingFlatIds.has(flat._id.toString())) return false;

        // Skip vacant flats - only generate for occupied flats
        if (!flat.isOccupied) return false;

        return true;
      })
      .map((flat) => {
        const { month: m, year: y } = parsePeriod(cleanPeriod);
        return {
          title: "Monthly Maintenance",
          flat: flat._id,
          amount: Number(amount),
          month: m,
          year: y,
          period: cleanPeriod,
          type: "Common",
          status: "UNPAID",
          createdBy: req.user.id,
        };
      });

    if (recordsToCreate.length === 0) {
      return res.status(200).json({
        success: true,
        message: `Maintenance for ${cleanPeriod} already generated or no target flats found.`,
        data: [],
      });
    }

    // 4. Insert new records
    try {
      const saved = await Maintenance.insertMany(recordsToCreate);
      console.log(`Generated ${saved.length} new records.`);

      res.status(201).json({
        success: true,
        message: `Generated: ${saved.length}. Skipped: ${flats.length - saved.length}.`,
        data: saved,
      });
    } catch (dbError) {
      console.error("Database Insert Error:", dbError);
      return res.status(400).json({
        success: false,
        message: dbError.message || "Failed to save maintenance records",
      });
    }
  } catch (error) {
    console.error("Generate common maintenance error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate common maintenance",
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
      maintenance.paymentMode = "CASH";
    } else {
      maintenance.paidBy = undefined;
      maintenance.paidAt = undefined;
      maintenance.paymentMode = undefined;
    }

    await maintenance.save();

    // Populate before sending back to avoid losing data in frontend state
    const updatedMaintenance = await Maintenance.findById(maintenanceId)
      .populate({
        path: "flat",
        select: "flatNumber wing isOccupied ownerName",
        populate: { path: "wing", select: "name" }
      })
      .populate("paidBy", "name email");

    res.status(200).json({
      success: true,
      message: `Maintenance marked as ${maintenance.status}`,
      data: updatedMaintenance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Status update failed", error: error.message });
  }
};

/* ================= RESIDENT ================= */

// RESIDENT → my maintenance
exports.getMyMaintenance = async (req, res) => {
  const user = await User.findById(req.user.id).select("flat flatAssignedDate");

  const query = {
    $or: [
      { flat: null },
      { flat: user.flat },
    ],
  };

  // Only show maintenance created after user joined
  if (user.flatAssignedDate) {
    query.createdAt = { $gte: user.flatAssignedDate };
  }

  const maintenance = await Maintenance.find(query)
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
    maintenance.paymentMode = "ONLINE";

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

    const updatedMaintenance = await Maintenance.findById(req.params.id)
      .populate({
        path: "flat",
        select: "flatNumber wing isOccupied ownerName",
        populate: { path: "wing", select: "name" }
      })
      .populate("paidBy", "name email");

    res.status(200).json({
      success: true,
      message: `Payment of ₹${amount} successful! Admin has been notified.`,
      data: updatedMaintenance,
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
