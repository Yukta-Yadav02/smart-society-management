// routes/maintenance.js
const express = require("express");
const router = express.Router();

const {
  createMaintenanceForAll,
  getAllMaintenance,
  getMyMaintenance,
  payMaintenance,
} = require("../controllers/Maintenance");

const { protect, authorizeRoles } = require("../middelware/auth");

// ADMIN
router.post(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  createMaintenanceForAll
);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getAllMaintenance
);

// RESIDENT
router.get(
  "/my",
  protect,
  authorizeRoles("RESIDENT"),
  getMyMaintenance
);

router.put(
  "/pay/:id",
  protect,
  authorizeRoles("RESIDENT"),
  payMaintenance
);

module.exports = router;
