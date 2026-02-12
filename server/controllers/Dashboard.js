const User = require("../models/User");
const Flat = require("../models/Flat");
const Maintenance = require("../models/Maintenance");
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");

// Admin Dashboard Stats
exports.getAdminStats = async (req, res) => {
  try {
    // Count statistics
    const totalResidents = await User.countDocuments({ role: "RESIDENT" });
    const totalFlats = await Flat.countDocuments();
    const occupiedFlats = await Flat.countDocuments({ isOccupied: true });
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "OPEN" });
    const totalMaintenance = await Maintenance.countDocuments();
    const paidMaintenance = await Maintenance.countDocuments({ status: "PAID" });
    const unpaidMaintenance = await Maintenance.countDocuments({ status: "UNPAID" });
    const totalNotices = await Notice.countDocuments();

    // Calculate amounts with error handling
    let totalMaintenanceAmount = 0;
    let paidMaintenanceAmount = 0;
    let unpaidMaintenanceAmount = 0;

    try {
      const totalResult = await Maintenance.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      totalMaintenanceAmount = totalResult[0]?.total || 0;

      const paidResult = await Maintenance.aggregate([
        { $match: { status: "PAID" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      paidMaintenanceAmount = paidResult[0]?.total || 0;

      const unpaidResult = await Maintenance.aggregate([
        { $match: { status: "UNPAID" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      unpaidMaintenanceAmount = unpaidResult[0]?.total || 0;
    } catch (aggregateError) {
      console.log("Aggregate calculation error:", aggregateError.message);
    }

    // Recent activities
    const recentComplaints = await Complaint.find()
      .populate("user", "name")
      .populate("flat", "flatNumber")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentMaintenance = await Maintenance.find()
      .populate("flat", "flatNumber")
      .populate("paidBy", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentNotices = await Notice.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalResidents,
          totalFlats,
          occupiedFlats,
          availableFlats: totalFlats - occupiedFlats,
          totalComplaints,
          pendingComplaints,
          resolvedComplaints: totalComplaints - pendingComplaints,
          totalMaintenance,
          paidMaintenance,
          unpaidMaintenance,
          totalNotices,
          totalMaintenanceAmount,
          paidMaintenanceAmount,
          unpaidMaintenanceAmount,
        },
        recentActivities: {
          complaints: recentComplaints,
          maintenance: recentMaintenance,
          notices: recentNotices,
        }
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
      data: {
        stats: {
          totalResidents: 0,
          totalFlats: 0,
          occupiedFlats: 0,
          availableFlats: 0,
          totalComplaints: 0,
          pendingComplaints: 0,
          resolvedComplaints: 0,
          totalMaintenance: 0,
          paidMaintenance: 0,
          unpaidMaintenance: 0,
          totalNotices: 0,
          totalMaintenanceAmount: 0,
          paidMaintenanceAmount: 0,
          unpaidMaintenanceAmount: 0,
        },
        recentActivities: {
          complaints: [],
          maintenance: [],
          notices: [],
        }
      }
    });
  }
};

// Resident Dashboard Stats
exports.getResidentStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'flat',
      populate: {
        path: 'wing',
        select: 'name'
      }
    });

    if (!user.flat) {
      return res.status(400).json({
        success: false,
        message: "No flat assigned to user"
      });
    }

    const myComplaints = await Complaint.countDocuments({ user: req.user.id });
    const pendingComplaints = await Complaint.countDocuments({
      user: req.user.id,
      status: "OPEN"
    });

    const myMaintenance = await Maintenance.countDocuments({
      $or: [
        { flat: user.flat._id },
        { flat: null } // Society-wide maintenance
      ]
    });

    const unpaidMaintenance = await Maintenance.countDocuments({
      $or: [
        { flat: user.flat._id },
        { flat: null }
      ],
      status: "UNPAID"
    });

    const unpaidAmount = await Maintenance.aggregate([
      {
        $match: {
          $or: [
            { flat: user.flat._id },
            { flat: null }
          ],
          status: "UNPAID"
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const myNotices = await Notice.countDocuments({
      $or: [
        { flat: null }, // General notices
        { flat: user.flat._id } // Flat-specific notices
      ]
    });

    const recentNotices = await Notice.find({
      $or: [
        { flat: null },
        { flat: user.flat._id }
      ]
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          myComplaints,
          pendingComplaints,
          resolvedComplaints: myComplaints - pendingComplaints,
          myMaintenance,
          unpaidMaintenance,
          paidMaintenance: myMaintenance - unpaidMaintenance,
          unpaidAmount: unpaidAmount[0]?.total || 0,
          myNotices,
        },
        flatInfo: {
          flatNumber: user.flat.flatNumber,
          wing: user.flat.wing,
          wingName: user.flat.wing?.name || '-',
          isOccupied: user.flat.isOccupied
        },
        recentNotices
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch resident stats",
      error: error.message
    });
  }
};