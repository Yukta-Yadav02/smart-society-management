const express = require("express");
const { protect, authorizeRoles } = require("../middelware/auth");
const { createFlat, getFlatsByBlock, assignFlat, vacateFlat, getAllFlats, updateOldRequests } = require("../controllers/flat");

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

module.exports = router;