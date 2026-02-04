// routes/flatRequestRoutes.js
const express = require("express");
const router = express.Router();

const {
  createFlatRequest,
  getAllFlatRequests,
  residentResponse,
  adminDecision,
} = require("../controllers/flatRequest");

const { protect, authorizeRoles } = require("../middelware/auth");

// User
router.post("/flat-requests", protect, createFlatRequest);

// Admin
router.get(
  "/flat-requests",
  protect,
  authorizeRoles("Admin","RESIDENT"),
  getAllFlatRequests
);

// Resident (only opinion)
router.put(
  "/flat-requests/:requestId/resident-response",
  protect,
  authorizeRoles("Resident"),
  residentResponse
);

// Admin final decision
router.put(
  "/flat-requests/:requestId/admin-decision",
  protect,
  authorizeRoles("Admin"),
  adminDecision
);

module.exports = router;