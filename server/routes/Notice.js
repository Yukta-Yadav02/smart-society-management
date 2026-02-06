const express = require("express");
const router = express.Router();

const {
  createNotice,
  getMyNotices,
  respondToNotice,
  getAllNotices,
  deleteNotice,
} = require("../controllers/Notice");

const { protect, authorizeRoles } = require("../middelware/auth");

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Notice routes working!" });
});

// Admin
router.post("/", protect, authorizeRoles("ADMIN"), createNotice);
router.get("/", protect, authorizeRoles("ADMIN"), getAllNotices);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteNotice);

// Resident
router.get("/my", protect, authorizeRoles("RESIDENT"), getMyNotices);
router.put("/:id/respond", protect, authorizeRoles("RESIDENT"), respondToNotice);

module.exports = router;