// routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/Complaint");


const { hasFlat, protect, authorizeRoles } = require("../middelware/auth");

// Resident
router.post("/complaints", protect, authorizeRoles("RESIDENT"),hasFlat, createComplaint);
router.get("/complaints/my", protect, authorizeRoles("RESIDENT"), hasFlat,getMyComplaints);

// Admin
router.get("/complaints", protect, authorizeRoles("ADMIN"), getAllComplaints);
router.put("/complaints/:id/status", protect, authorizeRoles("ADMIN"), updateComplaintStatus);

// Delete (any authenticated)
// router.delete("/complaints/:id", protect, deleteComplaint);

module.exports = router;