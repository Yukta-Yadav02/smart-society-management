const express = require("express");
const { setupAdmin,login, registerResident, createSecurity, toggleUserStatus, getAllResidents } = require("../controllers/Auth");
const { protect, authorizeRoles } = require("../middelware/auth");

const router = express.Router();
router.post("/setup-admin", setupAdmin);
router.post("/register",registerResident)
router.post("/login", login);
router.post(
  "/create-security",
  protect,
  authorizeRoles("ADMIN"),
  createSecurity
);

router.put("/toggle-status/", protect,authorizeRoles("ADMIN"), toggleUserStatus);

// Get all residents (ADMIN only)
router.get("/residents", protect, authorizeRoles("ADMIN"), getAllResidents);

module.exports = router;
