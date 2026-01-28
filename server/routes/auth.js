const express = require("express");
const { setupAdmin,login, registerResident, createSecurity } = require("../controllers/Auth");

const router = express.Router();
router.post("/setup-admin", setupAdmin);
router.post("/register",registerResident)
router.post("/login", login);
router.post("/create-security",createSecurity);



module.exports = router;
