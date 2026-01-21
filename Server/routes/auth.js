const express = require("express");
const { login,setupAdmin, signup } = require("../controllers/Auth");


const router = express.Router();

router.post("/login", login);
router.post("/setup-admin", setupAdmin);
router.post("/signup",signup)
 // Admin only

module.exports = router;
