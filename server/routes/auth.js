const express = require("express");
const { setupAdmin,login, signup } = require("../controllers/Auth");

const router = express.Router();
router.post("/setup-admin", setupAdmin);
router.post("/signup",signup)
router.post("/login", login);



module.exports = router;
