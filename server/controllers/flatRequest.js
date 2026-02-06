// controllers/flatRequestController.js
const FlatRequest = require("../models/FlatRequest");
const Flat = require("../models/Flat");
const User = require("../models/User");

/* 1. User applies for flat */
exports.createFlatRequest = async (req, res) => {
  try {

    
    const { flatId, ownershipType, remark } = req.body;

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

// exports.residentOpinion = async (req, res) => {
//   try {
//     const { response } = req.body;
//     const { requestId } = req.params;

<<<<<<< HEAD
//     if (!["Accepted", "Rejected"].includes(response)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid response",
//       });
//     }

//     const request = await FlatRequest.findById(requestId).populate("flat");
=======
    console.log('Resident opinion request:', {
      requestId,
      response,
      userId: req.user.id
    });

    if (!["Accepted", "Rejected"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Invalid response",
      });
    }

    const request = await FlatRequest.findById(requestId)
      .populate("flat")
      .populate("user", "name email");
>>>>>>> f057846 (all pages connectivity)

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

<<<<<<< HEAD
//     // only current resident can respond
//     if (
//       request.flat.currentResident?.toString() !== req.user.id
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Not allowed",
//       });
//     }

//     // opinion only once
//     if (request.residentOpinion !== "Pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Already responded",
//       });
//     }
=======
    console.log('Request details:', {
      flatId: request.flat._id,
      currentResident: request.flat.currentResident,
      requestingUserId: req.user.id
    });

    // Check if current user is the flat's current resident
    const currentUser = await User.findById(req.user.id).populate('flat');
    
    // More flexible authorization - check if user's flat matches request flat
    const isAuthorized = currentUser.flat && 
                        currentUser.flat._id.toString() === request.flat._id.toString();
    
    if (!isAuthorized) {
      console.log('Authorization failed:', {
        userFlat: currentUser.flat?._id,
        requestFlat: request.flat._id
      });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to respond to this request",
      });
    }

    // Check if already responded
    if (request.residentOpinion !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Already responded to this request",
      });
    }
>>>>>>> f057846 (all pages connectivity)

//     request.residentOpinion = response;
//     await request.save();

<<<<<<< HEAD
//     res.status(200).json({
//       success: true,
//       message: `Resident ${response} the request`,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to save resident opinion",
//     });
//   }
// };
=======
    // Admin notification
    console.log(`🔔 ADMIN NOTIFICATION:`);
    console.log(`   Resident Response: ${response.toUpperCase()}`);
    console.log(`   Flat: ${request.flat.flatNumber}`);
    console.log(`   Status: ${response === 'Accepted' ? 'READY FOR ADMIN APPROVAL ✅' : 'REQUEST REJECTED ❌'}`);
    console.log(`   Time: ${new Date().toLocaleString()}`);

    res.status(200).json({
      success: true,
      message: `Resident ${response} the request. Admin has been notified.`,
    });
  } catch (error) {
    console.error('Resident opinion error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to save resident opinion",
    });
  }
};
>>>>>>> f057846 (all pages connectivity)


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

    /**
     * CASE 1: FLAT OCCUPIED
     * If resident accepted, auto-approve. If rejected, reject the request.
     */
    if (flat.currentResident) {
      // Check if currentResident actually exists in database
      const actualResident = await User.findById(flat.currentResident);
      
      if (!actualResident) {
        // If resident doesn't exist, clear the flat and allow approval
        await Flat.findByIdAndUpdate(flat._id, {
          currentResident: null,
          isOccupied: false
        });
        console.log(`Cleared non-existent resident from flat ${flat.flatNumber}`);
      } else {
        // Allow admin override if specified
        if (!req.body.adminOverride && request.residentOpinion === "Pending") {
          return res.status(400).json({
            success: false,
            message: "Resident response required before decision",
          });
        }
        
        // If resident rejected, admin can only reject (unless override)
        if (!req.body.adminOverride && request.residentOpinion === "Rejected" && decision === "Approved") {
          return res.status(400).json({
            success: false,
            message: "Cannot approve when current resident has rejected",
          });
        }
      }
    }

    request.status = decision;
    request.decidedByAdmin = req.user.id;

    // assign flat only when approved
    if (decision === "Approved") {
      // Remove current resident if exists
      if (flat.currentResident) {
        // Completely remove old user's flat assignment
        await User.findByIdAndUpdate(flat.currentResident, {
          flat: null,
          status: "INACTIVE"
        });
        
        // Also remove from flat's currentResident field
        await Flat.findByIdAndUpdate(flat._id, {
          currentResident: null,
          isOccupied: false
        });
        
        console.log(`Removed previous resident from flat ${flat.flatNumber}`);
      }

      // Assign new resident
      await Flat.findByIdAndUpdate(flat._id, {
        currentResident: request.user._id,
        isOccupied: true,
        resident: {
          _id: request.user._id,
          name: request.user.name,
          email: request.user.email
        }
      });

      await User.findByIdAndUpdate(request.user._id, {
        flat: flat._id,
        status: "ACTIVE"
      });

      console.log(`✅ FLAT TRANSFER COMPLETED:`);
      console.log(`   Old Resident: REMOVED from flat ${flat.flatNumber}`);
      console.log(`   New Resident: ${request.user.name} assigned to flat ${flat.flatNumber}`);
      console.log(`   Transfer Time: ${new Date().toLocaleString()}`);
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