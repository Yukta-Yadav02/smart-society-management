const Notice = require("../models/Notice");
const User = require("../models/User");
const Flat = require("../models/Flat");

exports.createNotice = async (req, res) => {
  console.log("=== CREATE NOTICE DEBUG ===");
  console.log("Request body:", req.body);
  console.log("User:", req.user);
  
  try {
    const { title, message, flat } = req.body;

    if (!title || !message) {
      console.log("Validation failed - missing title or message");
      return res.status(400).json({
        success: false,
        message: "Title and message required",
      });
    }

    if (flat) {
      const flatExists = await Flat.findById(flat);
      if (!flatExists) {
        return res.status(404).json({
          success: false,
          message: "Flat not found",
        });
      }
    }

    console.log("Creating notice with data:", { title, message, flat, createdBy: req.user.id });
    
    const notice = await Notice.create({
      title,
      message,
      flat: flat || null,
      createdBy: req.user.id,
    });

    console.log("Notice created successfully:", notice);

    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (err) {
    console.error("Create notice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// get my notice

exports.getMyNotices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("flat");

    const notices = await Notice.find({
      $or: [
        { flat: null },        // general
        { flat: user.flat },   // my flat
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.respondToNotice = async (req, res) => {
  const { response } = req.body;

  if (!["ACCEPTED", "REJECTED"].includes(response)) {
    return res.status(400).json({
      success: false,
      message: "Invalid response",
    });
  }

  const notice = await Notice.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!notice || !notice.flat) {
    return res.status(400).json({
      success: false,
      message: "Not a respondable notice",
    });
  }

  if (notice.flat.toString() !== user.flat.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  notice.responseStatus = response;
  await notice.save();

  res.status(200).json({
    success: true,
    message: `Notice ${response}`,
  });
};



exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("flat", "flatNumber")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN → delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
      error: error.message
    });
  }
};