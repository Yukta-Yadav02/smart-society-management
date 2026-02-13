// controllers/flatRequestController.js
// [OWNERSHIP FLOW] - Correct model import
const FlatRequest = require("../models/flatRequest");
const Flat = require("../models/Flat");
const User = require("../models/User");

/* 1. User applies for flat */
exports.createFlatRequest = async (req, res) => {
  try {


    const { flatId, ownershipType, remark, contactNumber, memberCount, aadhaarNumber } = req.body;

    console.log('Flat request data:', { flatId, ownershipType, remark, userId: req.user.id });

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
      contactNumber,
      memberCount,
      aadhaarNumber
    });

    console.log('Created request:', request);

    return res.status(201).json({
      success: true,
      message: "Flat request submitted, waiting for admin approval",
      data: request,
    });
  } catch (error) {
    console.error('Create flat request error:', error);
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
      .populate({
        path: "flat",
        populate: {
          path: "wing",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    // Clean up requests with non-existent residents
    for (const request of requests) {
      if (request.flat && request.flat.currentResident) {
        const residentExists = await User.findById(request.flat.currentResident);
        if (!residentExists) {
          // Reset residentOpinion if resident doesn't exist
          if (request.residentOpinion === 'Pending' && request.status === 'Pending') {
            request.residentOpinion = 'Pending';
            await request.save();
          }
        }
      }
    }

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

exports.residentOpinion = async (req, res) => {
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

    // only current resident can respond
    if (
      request.flat.currentResident?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // opinion only once
    if (request.residentOpinion !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Already responded",
      });
    }

    request.residentOpinion = response;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Resident ${response} the request`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save resident opinion",
    });
  }
};


/* 4. Admin final decision */
exports.adminDecision = async (req, res) => {
  try {
    const { decision, adminMessage } = req.body;
    const { requestId } = req.params;

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision",
      });
    }

    const request = await FlatRequest.findById(requestId).populate("flat").populate("user");
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

    // Check if currentResident actually exists
    let actualResident = null;
    if (flat.currentResident) {
      actualResident = await User.findById(flat.currentResident);
      
      if (!actualResident) {
        // Clear stale resident data
        await Flat.findByIdAndUpdate(flat._id, {
          currentResident: null,
          isOccupied: false,
          resident: null
        });
        // Reset residentOpinion in request since no resident exists
        request.residentOpinion = "Pending";
        console.log(`Cleared non-existent resident from flat ${flat.flatNumber}`);
      }
    }

    // Only check resident opinion if actual resident exists
    if (actualResident && request.residentOpinion === "Rejected") {
      if (decision === "Approved") {
        return res.status(400).json({
          success: false,
          message: "Cannot approve when current resident has rejected",
        });
      }
      request.status = "Rejected";
      request.decidedByAdmin = req.user.id;
      if (adminMessage) request.adminMessage = adminMessage;
      await request.save();
      return res.status(200).json({
        success: true,
        message: "Request rejected as per resident's decision",
        data: request
      });
    }

    request.status = decision;
    request.decidedByAdmin = req.user.id;
    if (adminMessage) {
      request.adminMessage = adminMessage;
    }

    // assign flat only when approved
    if (decision === "Approved") {
      // Check if flat is already occupied by someone else
      const existingResident = await User.findOne({ 
        flat: flat._id, 
        _id: { $ne: request.user._id },
        status: "ACTIVE"
      });

      if (existingResident) {
        // Vacate old resident first
        await User.findByIdAndUpdate(existingResident._id, {
          flat: null,
          status: "PENDING"
        });
        
        await Flat.findByIdAndUpdate(flat._id, {
          isOccupied: false,
          currentResident: null,
          resident: null
        });
        
        console.log(`Vacated ${existingResident.name} from flat ${flat.flatNumber}`);
      }

      // [OWNERSHIP FLOW] - Check if this is an Ownership request or Rental request
      if (request.ownershipType === "OWNER") {
        // CASE: FLAT SOLD (Naya Malik)
        await Flat.findByIdAndUpdate(flat._id, {
          owner: request.user._id,
          // Agar malik khud rehne aa raha hai toh resident bhi wahi hoga
          currentResident: request.user._id,
          isOccupied: true,
          resident: {
            _id: request.user._id,
            name: request.user.name,
            email: request.user.email
          }
        });
        console.log(`🏠 OWNERSHIP TRANSFERRED: Flat ${flat.flatNumber} now owned by ${request.user.name}`);
      }
      else if (request.ownershipType === "TENANT") {
        // CASE: FLAT ON RENT (Kirayedar aaya hai, Malik purana hi rahega)

        // Remove old resident if exists
        if (flat.currentResident) {
          await User.findByIdAndUpdate(flat.currentResident, {
            flat: null,
            status: "INACTIVE"
          });
        }

        // Update Flat occupancy but KEEP the existing owner
        await Flat.findByIdAndUpdate(flat._id, {
          currentResident: request.user._id,
          isOccupied: true,
          resident: {
            _id: request.user._id,
            name: request.user.name,
            email: request.user.email
          }
        });
        console.log(`🔑 RENTAL START: Flat ${flat.flatNumber} rented by ${request.user.name}. Owner remains same.`);
      }

      // Update user status and sync role/type
      await User.findByIdAndUpdate(request.user._id, {
        flat: flat._id,
        status: "ACTIVE",
        residentType: request.ownershipType,
        flatAssignedDate: new Date()
      });
    }

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request ${decision} successfully`,
      data: request
    });
  } catch (error) {
    console.error('Admin decision error:', error);
    return res.status(500).json({
      success: false,
      message: "Admin decision failed",
      error: error.message,
    });
  }
};


exports.getMyFlatRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FlatRequest.find({ user: userId })
      .populate("user", "name email")
      .populate({
        path: "flat",
        populate: {
          path: "wing",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};
/* Get flat transfer requests for current resident */
exports.getMyFlatTransferRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate('flat');

    if (!currentUser.flat) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No flat assigned"
      });
    }

    // Find requests for current user's flat where resident opinion is pending
    const requests = await FlatRequest.find({
      flat: currentUser.flat._id,
      residentOpinion: "Pending",
      status: "Pending"
    })
      .populate("user", "name email")
      .populate("flat", "flatNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Get transfer requests error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transfer requests",
    });
  }
};

// Update old requests to OWNER
exports.updateOldRequestsToOwner = async (req, res) => {
  try {
    console.log('Starting update of old requests...');

    const result = await FlatRequest.updateMany(
      { ownershipType: 'RESIDENT' },
      { $set: { ownershipType: 'OWNER' } }
    );

    console.log('Update result:', result);

    return res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} requests to OWNER`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update requests",
      error: error.message
    });
  }
};