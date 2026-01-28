// routes/visitor.js
const express = require("express");
const router = express.Router();

const {
  createVisitorEntry,
  markVisitorExit,
  getMyFlatVisitors,
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

// RESIDENT
router.get(
  "/my",
  protect,
  authorizeRoles("RESIDENT"),
  getMyFlatVisitors
);

module.exports = router;