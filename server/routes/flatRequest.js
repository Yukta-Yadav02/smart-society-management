const express = require("express");
const router = express.Router();

const {
  createFlatRequest,
  getMyFlatRequests,
  getAllFlatRequests,
  adminDecision,
  updateOldRequestsToOwner,
  residentOpinion,
  getMyFlatTransferRequests,
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

// Resident → view transfer requests for their flat (MUST BE BEFORE /flat-requests)
router.get(
  "/flat-requests/transfer-requests",
  protect,
  authorizeRoles("RESIDENT"),
  getMyFlatTransferRequests
);

// Resident → view own requests
router.get(
  "/flat-requests",
  protect,
  authorizeRoles("RESIDENT"),
  getMyFlatRequests
);

// Resident (only opinion)
router.put(
  "/flat-requests/:requestId/resident-response",
  protect,
  authorizeRoles("RESIDENT"),
  residentOpinion
);

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
