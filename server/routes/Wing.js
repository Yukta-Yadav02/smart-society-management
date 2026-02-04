const express = require("express");

const { createWing, getWings } = require("../controllers/wing");
const { protect, authorizeRoles } = require("../middelware/auth");

const router = express.Router();
router.post(
"/",
protect,
authorizeRoles("ADMIN"),
createWing
);
router.get("/",getWings);

module.exports = router;
