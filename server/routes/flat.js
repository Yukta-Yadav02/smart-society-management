const express = require("express");
const { protect, authorizeRoles } = require("../middelware/auth");
const { createFlat, getFlatsByBlock } = require("../controllers/flat");

const router = express.Router();

router.post("/",
    protect,
    authorizeRoles("ADMIN"),
    createFlat);

router.get("/wing/:wingId",getFlatsByBlock)

module.exports = router;