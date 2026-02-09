const express = require("express");
const { protect, authorizeRoles } = require("../middelware/auth");
const { createFlat, getFlatsByBlock, assignFlat, vacateFlat, getAllFlats, updateOldRequests, initializeOwnership, deleteFlat } = require("../controllers/flat");

const router = express.Router();

router.post("/",
    protect,
    authorizeRoles("ADMIN"),
    createFlat);

router.get("/wing/:wingId", getFlatsByBlock);

// Get all flats
router.get("/", getAllFlats);

// Get single flat by ID
router.get("/:flatId", async (req, res) => {
  try {
    const Flat = require("../models/Flat");
    const flat = await Flat.findById(req.params.flatId)
      .populate("wing", "name")
      .populate("currentResident", "name email")
      .populate("owner", "name email");
    
    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found"
      });
    }

    res.status(200).json({
      success: true,
      data: flat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch flat",
      error: error.message
    });
  }
});

// Update old requests (ADMIN only)
router.post("/update-requests",
    protect,
    authorizeRoles("ADMIN"),
    updateOldRequests);

// [OWNERSHIP FLOW] - Initialize ownership for all flats
router.post("/initialize-ownership",
    protect,
    authorizeRoles("ADMIN"),
    initializeOwnership);

// Assign flat to resident (ADMIN only)
router.put("/assign",
    protect,
    authorizeRoles("ADMIN"),
    assignFlat);

// Vacate flat (ADMIN only)
router.put("/vacate/:flatId",
    protect,
    authorizeRoles("ADMIN"),
    vacateFlat);

// Delete flat (ADMIN only)
router.delete("/:flatId",
    protect,
    authorizeRoles("ADMIN"),
    deleteFlat);

module.exports = router;