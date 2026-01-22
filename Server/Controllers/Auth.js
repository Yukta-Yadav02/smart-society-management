const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* =========================
   ONE TIME ADMIN SETUP
========================= */
exports.setupAdmin = async (req, res) => {
  try {
    // check if admin already exists
    // const adminExists = await User.findOne({ role: "Admin" });

    // if (adminExists) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Admin already exists",
    //   });
    // }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
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
exports.signup = async (req, res) =>{

  try {
    // only Admin allowed (assume middleware check)
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role:"Resident",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data:user,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User creation failed",
      error:error.message
    });
  }
};

/* =========================
   USER LOGIN
========================= */
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
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
    const token = jwt.sign(
      { 
      id: user._id,
      role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      role: user.role,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
