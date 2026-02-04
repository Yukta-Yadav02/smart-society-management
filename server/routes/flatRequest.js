// routes/flatRequestRoutes.js
const express = require("express");
const router = express.Router();

const {
  createFlatRequest,
  getAllFlatRequests,
  adminDecision,
  residentOpinion,
} = require("../controllers/flatRequest");

const { protect, authorizeRoles } = require("../middelware/auth");

// User
router.post("/flat-requests", protect, createFlatRequest);

// Admin
router.get(
  "/flat-requests",
  protect,
  authorizeRoles("Admin","RESIDENT"),
  authorizeRoles("ADMIN"),
  getAllFlatRequests
);

// Resident (only opinion)
router.put(
  "/flat-requests/:requestId/resident-response",
  protect,
  authorizeRoles("RESIDENT"),
  residentOpinion
);

// Admin final decision
router.put(
  "/flat-requests/:requestId/admin-decision",
  protect,
  authorizeRoles("ADMIN"),
  adminDecision
);

module.exports = router;