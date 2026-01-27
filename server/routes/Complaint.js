// routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/Complaint");


const { hasFlat, protect, authorizeRoles } = require("../middelware/auth");

// Resident
router.post("/complaints", protect, authorizeRoles("Resident"),hasFlat, createComplaint);
router.get("/complaints/my", protect, authorizeRoles("Resident"), hasFlat,getMyComplaints);

// Admin
router.get("/complaints", protect, authorizeRoles("Admin"), getAllComplaints);
router.put("/complaints/:id/status", protect, authorizeRoles("Admin"), updateComplaintStatus);

// Delete (any authenticated)
router.delete("/complaints/:id", protect, deleteComplaint);

module.exports = router;