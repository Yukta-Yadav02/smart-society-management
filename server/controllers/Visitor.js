// controllers/visitor.js
const Visitor = require("../models/Visitor");
const Flat = require("../models/Flat");

exports.createVisitorEntry = async (req, res) => {
  try {
    const { name, mobile, purpose, flatId } = req.body;

    if (!name || !mobile || !purpose || !flatId) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    const visitor = await Visitor.create({
      name,
      mobile,
      purpose,
      flat: flatId,
      enteredBy: req.user.id, // SECURITY
    });

    res.status(201).json({
      success: true,
      message: "Visitor entry recorded",
      data: visitor,
    });
  } catch (error) {
    console.error('Visitor entry error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create visitor entry",
      error: error.message,
    });
  }
};

exports.markVisitorExit = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status === "OUT") {
      return res.status(400).json({
        success: false,
        message: "Visitor already exited",
      });
    }

    visitor.status = "OUT";
    visitor.exitTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor exit marked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark exit",
    });
  }
};
// Get all visitors history (both IN and OUT)
exports.getAllVisitorsHistory = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate("flat", "flatNumber wing")
      .populate("enteredBy", "name")
      .sort({ entryTime: -1 });

    res.status(200).json({
      success: true,
      message: "Visitor history fetched successfully",
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch visitor history",
    });
  }
};

// Get only active visitors (status = "IN")
exports.getActiveVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: "IN" })
      .populate("flat", "flatNumber wing")
      .populate("enteredBy", "name")
      .sort({ entryTime: -1 });

    res.status(200).json({
      success: true,
      message: "Active visitors fetched successfully",
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active visitors",
    });
  }
};

// Get peak hours
exports.getPeakHours = async (req, res) => {
  try {
    const visitors = await Visitor.find();
    const hourlyCount = {};

    visitors.forEach((visitor) => {
      const hour = new Date(visitor.entryTime).getHours();
      if (hour >= 12 && hour < 13) {
        hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
      }
    });

    const peakHours = Object.entries(hourlyCount).map(([hour, count]) => {
      const h = parseInt(hour);
      if (count === 1) {
        const period = h >= 12 ? "PM" : "AM";
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return { time: `${displayHour}:00 ${period}`, count };
      } else {
        const period1 = h >= 12 ? "PM" : "AM";
        const period2 = (h + 1) >= 12 ? "PM" : "AM";
        const displayHour1 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const displayHour2 = (h + 1) > 12 ? (h + 1) - 12 : (h + 1) === 0 ? 12 : (h + 1);
        return { time: `${displayHour1}:00 ${period1} - ${displayHour2}:00 ${period2}`, count };
      }
    });

    res.status(200).json({ success: true, data: peakHours });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch peak hours" });
  }
};