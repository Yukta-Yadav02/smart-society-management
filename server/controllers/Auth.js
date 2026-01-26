const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


/* =========================
   ONE TIME ADMIN SETUP
========================= */
exports.setupAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "ADMIN" });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const { name, email, password } = req.body;
    if(!name || !email || !password){
      return res.status(400).json({
        success:false,
        message:"All fields are required",
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    });

    return res.status(201).json({
      success: true,
      message: "Admin (Secretary) created successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin setup failed",
    });
  }
};
/* =========================
   ADMIN → CREATE USER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "RESIDENT",     // public bhi resident hi hai
      status: "PENDING",    // approval baaki
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Please request a flat.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/* =========================
   USER LOGIN
========================= */
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }

    // check user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid User",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate JWT
    const token = jwt.sign({ 
      id: user._id,
      role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
    //   sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      role: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
