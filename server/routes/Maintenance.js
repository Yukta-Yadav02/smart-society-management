// routes/maintenance.js
const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  getMyMaintenance,
  payMaintenance,
} = require("../controllers/Maintenance");

const { protect, authorizeRoles } = require("../middelware/auth");

// Admin
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createMaintenance
);

// Resident
router.get(
  "/my",
  protect,
  getMyMaintenance
);

router.put(
  "/pay/:id",
  protect,
  payMaintenance
);

module.exports = router;