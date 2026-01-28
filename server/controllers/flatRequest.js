// controllers/flatRequestController.js
const FlatRequest = require("../models/FlatRequest");
const Flat = require("../models/Flat");
const User = require("../models/User");

/* 1. User applies for flat */
exports.createFlatRequest = async (req, res) => {
  try {

    
    const { flatId, ownershipType, remark } = req.body;

    
    const exists = await FlatRequest.findOne({
          user: req.user.id,
          flat: flatId,
          status: "Pending",
      });

if (exists) {
  return res.status(400).json({
    success: false,
    message: "You already have a pending request for this flat",
  });
}

    if (!flatId || !ownershipType) {
      return res.status(400).json({
        success: false,
        message: "Flat and ownership type required",
      });
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    const request = await FlatRequest.create({
        user: req.user.id,
      flat: flatId,
      ownershipType,
      remark,
    });

    console.log(request)

    return res.status(201).json({
      success: true,
      message: "Flat request submitted, waiting for admin approval",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create flat request",
      error: error.message,
    });
  }
};

/* 2. Admin sees all requests */
exports.getAllFlatRequests = async (req, res) => {
  try {
    const requests = await FlatRequest.find()
      .populate("user", "name email")
      .populate("flat")
      .sort({ createdAt: -1 });
      
      console.log(requests);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

/* 3. Resident gives opinion (Accept / Reject) */
exports.residentResponse = async (req, res) => {
  try {
    const { response } = req.body;
    const { requestId } = req.params;

    if (!["Accepted", "Rejected"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Invalid response",
      });
    }

    const request = await FlatRequest.findById(requestId).populate("flat");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (
      request.flat.currentResident.toString() !== req.user.id
      ) {
      return res.status(403).json({ message: "Not allowed" });
      }

    request.residentOpinion = response;
    await request.save();

    return res.status(200).json({
      success: true,
      message: `Resident ${response} the request`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update resident response",
    });
  }
};

/* 4. Admin final decision */
exports.adminDecision = async (req, res) => {
  try {
    const { decision } = req.body;
    const { requestId } = req.params;

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision",
      });
    }

    const request = await FlatRequest.findById(requestId).populate("flat");
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // already processed
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    const flat = await Flat.findById(request.flat._id);

    /**
     * CASE 1: FLAT OCCUPIED
     * Admin must wait for resident response
     */
    if (flat.currentResident) {
      if (request.residentOpinion === "Pending") {
        return res.status(400).json({
          success: false,
          message: "Resident response required before decision",
        });
      }
    }

    /**
     * CASE 2: FLAT EMPTY
     * Admin manually approves or rejects
     * (no resident, no notice)
     */

    request.status = decision;
    request.decidedByAdmin = req.user.id;

    // assign flat only when approved
    if (decision === "Approved") {
      await Flat.findByIdAndUpdate(flat._id, {
        currentResident: request.user,
        isOccupied: true,
      });

      await User.findByIdAndUpdate(request.user, {
        flat: flat._id,
        status: "ACTIVE"
      });
    }

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request ${decision} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin decision failed",
      error: error.message,
    });
  }
};