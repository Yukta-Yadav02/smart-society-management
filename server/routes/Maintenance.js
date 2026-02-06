// routes/maintenance.js
const express = require("express");
const router = express.Router();

const {
  getAllMaintenance,
  getMyMaintenance,
  payMaintenance,
  createMaintenance,
  generateCommonMaintenance,
  deleteMaintenance,
} = require("../controllers/Maintenance");

const { protect, authorizeRoles } = require("../middelware/auth");
router.get("/test", (req, res) => {
  res.send("Maintenance route works!");
});

// ADMIN
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createMaintenance
);

router.post(
  "/generate",
  protect,
  authorizeRoles("ADMIN"),
  generateCommonMaintenance
);

router.get(
  "/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllMaintenance
);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getAllMaintenance
);

// Delete maintenance record (ADMIN only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteMaintenance
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
