const Complaint = require("../models/Complaint");
const User = require("../models/User");

/**
 * Create complaint with flat validation
 */
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, flatId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Fetch user with flat info
    const user = await User.findById(req.user.id).populate('flat');

    // User must have a flat assigned
    if (!user.flat) {
      return res.status(403).json({
        success: false,
        message: "You cannot create a complaint without an assigned flat. Please contact admin to assign a flat.",
      });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      flat: user.flat._id,
    });
   
    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.flat) {
      return res.status(403).json({
        success: false,
        message: "You cannot view complaints without an assigned flat",
      });
    }

    const complaints = await Complaint.find({ user: req.user.id })
      .populate("flat", "flatNumber")
      .sort({ createdAt: -1 });
     console.log(complaints)
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 26. Admin sees all complaints
 */
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("flat", "flatNumber")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 27. Admin updates complaint status
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["OPEN", "IN PROGRESS", "RESOLVED", "REJECTED"];

     if (!allowedStatuses.includes(status)) {
     return res.status(400).json({ message: "Invalid status" });
   }


    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



