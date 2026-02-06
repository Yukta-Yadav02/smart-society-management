const express = require("express");
const router = express.Router();

const {
  createFlatRequest,
  getAllFlatRequests,
  adminDecision,
<<<<<<< HEAD
=======
  residentOpinion,
  getMyFlatRequests,
  getMyFlatTransferRequests,
  updateOldRequestsToOwner
>>>>>>> f057846 (all pages connectivity)
} = require("../controllers/flatRequest");

const { protect, authorizeRoles } = require("../middelware/auth");

// ================= USER / RESIDENT =================

// Create flat request
router.post(
  "/flat-requests",
  protect,
  authorizeRoles("RESIDENT"),
  createFlatRequest
);

// Resident → view own requests
router.get(
  "/flat-requests",
  protect,
  authorizeRoles("RESIDENT"),
  getMyFlatRequests
);

<<<<<<< HEAD
// Resident (only opinion)
// router.put(
//   "/flat-requests/:requestId/resident-response",
//   protect,
//   authorizeRoles("RESIDENT"),
//   residentOpinion
// );
=======
// Resident → get flat transfer requests for their flat
router.get(
  "/flat-requests/transfer-requests",
  protect,
  authorizeRoles("RESIDENT"),
  getMyFlatTransferRequests
);

// Resident response
router.put(
  "/flat-requests/:requestId/resident-response",
  protect,
  authorizeRoles("RESIDENT"),
  residentOpinion
);
>>>>>>> f057846 (all pages connectivity)

// ================= ADMIN =================

// Admin → view all requests
router.get(
  "/flat-requests/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllFlatRequests
);

// Admin final decision
router.put(
  "/flat-requests/:requestId/admin-decision",
  protect,
  authorizeRoles("ADMIN"),
  adminDecision
);

// Update old requests to OWNER
router.post(
  "/flat-requests/update-old",
  protect,
  authorizeRoles("ADMIN"),
  updateOldRequestsToOwner
);

module.exports = router;
