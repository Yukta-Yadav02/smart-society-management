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