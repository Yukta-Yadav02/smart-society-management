// routes/visitor.js
const express = require("express");
const router = express.Router();

const {
  createVisitorEntry,
  markVisitorExit,
  getAllVisitorsHistory,
  getActiveVisitors,
  getPeakHours,
} = require("../controllers/Visitor");

const { protect, authorizeRoles } = require("../middelware/auth");

// SECURITY
router.post(
  "/entry",
  protect,
  authorizeRoles("SECURITY"),
  createVisitorEntry
);

router.put(
  "/exit/:id",
  protect,
  authorizeRoles("SECURITY"),
  markVisitorExit
);

// Get all visitors history (both IN and OUT)
router.get(
  "/history",
  protect,
  authorizeRoles("SECURITY"),
  getAllVisitorsHistory
);

// Get only active visitors (currently inside)
router.get(
  "/active",
  protect,
  authorizeRoles("SECURITY"),
  getActiveVisitors
);

// Get peak hours
router.get(
  "/peak-hours",
  protect,
  authorizeRoles("SECURITY"),
  getPeakHours
);

// // RESIDENT
// router.get(
//   "/my",
//   protect,
//   authorizeRoles("RESIDENT"),
//   getMyFlatVisitors
// );

module.exports = router;