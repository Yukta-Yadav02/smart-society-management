const Notice = require("../models/Notice");
const User = require("../models/User");
const Flat = require("../models/Flat");

exports.createNotice = async (req, res) => {
  try {
    const { title, message, targetUser, targetFlat, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    //  both user & flat together not allowed
    if (targetUser && targetFlat) {
      return res.status(400).json({
        success: false,
        message: "Provide either targetUser or targetFlat, not both",
      });
    }

    // validate target user
    if (targetUser) {
      const user = await User.findById(targetUser);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Target user not found",
        });
      }
    }

    // validate target flat
    if (targetFlat) {
      const flat = await Flat.findById(targetFlat);
      if (!flat || !flat.currentResident) {
        return res.status(400).json({
          success: false,
          message: "Flat not occupied or invalid",
        });
      }
    }

    const notice = await Notice.create({
      title,
      message,
      type,
      targetUser: targetUser || null,
      targetFlat: targetFlat || null,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Notice sent successfully",
      data: notice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create notice",
      error: error.message,
    });
  }
};

// get my notice

exports.getMyNotices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const notices = await Notice.find({
      $or: [
        { targetUser: user._id },
        { targetFlat: user.flat },
        { targetUser: null }, // general
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

exports.respondToNotice = async (req, res) => {
  
  try {
    const { response } = req.body;
    const noticeId = req.params.id;

    if (!["ACCEPTED", "REJECTED"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Invalid response",
      });
    }

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    const user = await User.findById(req.user.id);

    // validation: only assigned user can respond
    if (
      notice.targetUser?.toString() !== user._id.toString() &&
      notice.targetFlat?.toString() !== user.flat?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to respond to this notice",
      });
    }

    notice.status = response;
    await notice.save();

    return res.status(200).json({
      success: true,
      message: `Notice ${response}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to respond to notice",
    });
  }
};


exports.getAllNotices = async (req, res) => {
  const notices = await Notice.find()
    .populate("targetUser", "name email")
    .populate("targetFlat", "flatNumber")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: notices,
  });
};