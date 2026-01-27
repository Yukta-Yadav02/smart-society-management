const express = require("express");
const router = express.Router();

const {
  createNotice,
  getMyNotices,
  respondToNotice,
  getAllNotices,
} = require("../controllers/Notice");

const { protect, authorizeRoles } = require("../middelware/auth");

// Admin
router.post("/", protect, authorizeRoles("ADMIN"), createNotice);
router.get("/", protect, authorizeRoles("ADMIN"), getAllNotices);

// Resident
router.get("/my", protect, authorizeRoles("RESIDENT"), getMyNotices);
router.put("/:id/respond", protect, authorizeRoles("RESIDENT"), respondToNotice);

module.exports = router;