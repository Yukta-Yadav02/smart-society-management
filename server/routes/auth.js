const express = require("express");
const {
  setupAdmin,
  login,
  registerResident,
  createSecurity,
  toggleUserStatus,
  getAllResidents,
  updateResident,
  deleteUser,
  updateResidentTypes,
  getProfile
} = require("../controllers/Auth");
const { protect, authorizeRoles } = require("../middelware/auth");

const router = express.Router();
router.post("/setup-admin", setupAdmin);
router.post("/register", registerResident)
router.post("/login", login);
router.post(
  "/create-security",
  protect,
  authorizeRoles("ADMIN"),
  createSecurity
);

router.put("/toggle-status/", protect, authorizeRoles("ADMIN"), toggleUserStatus);

// Get current user profile
router.get("/profile", protect, getProfile);

// Get all residents (ADMIN only)
router.get("/residents", protect, authorizeRoles("ADMIN"), getAllResidents);

// Update/Delete residents (ADMIN only)
router.put("/update-resident/:id", protect, authorizeRoles("ADMIN"), updateResident);
router.delete("/delete-user/:id", protect, authorizeRoles("ADMIN"), deleteUser);

// Maintenance route to fix resident types
router.post("/update-resident-types", protect, authorizeRoles("ADMIN"), updateResidentTypes);

module.exports = router;

