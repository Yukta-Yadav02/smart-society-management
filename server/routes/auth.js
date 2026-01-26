const express = require("express");
const { setupAdmin,login,  register } = require("../controllers/Auth");

const router = express.Router();
router.post("/setup-admin", setupAdmin);
router.post("/register",register)
router.post("/login", login);



module.exports = router;
