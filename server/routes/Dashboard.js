const express = require("express");
const router = express.Router();

const { getAdminStats, getResidentStats } = require("../controllers/Dashboard");
const { protect, authorizeRoles } = require("../middelware/auth");

// Admin dashboard stats
router.get(
  "/admin-stats",
  protect,
  authorizeRoles("ADMIN"),
  getAdminStats
);

// Resident dashboard stats
router.get(
  "/resident-stats",
  protect,
  authorizeRoles("RESIDENT"),
  getResidentStats
);

module.exports = router;