const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
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
      message: "Admin created successfully",
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
   PUBLIC → REGISTER RESIDENT
========================= */
exports.registerResident = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Map frontend type to backend residentType (Default to OWNER)
    const residentType = (type && type.toLowerCase() === 'tenant') ? 'TENANT' : 'OWNER';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "RESIDENT",
      status: "PENDING",
      residentType
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Waiting for admin approval.",
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
   ADMIN → CREATE SECURITY
========================= */
exports.createSecurity = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const security = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "SECURITY",
      status: "ACTIVE",
    });

    return res.status(201).json({
      success: true,
      message: "Security created successfully",
      data: security,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Security creation failed",
    });
  }
};

/* =========================
   USER LOGIN (ALL ROLES)
========================= */
exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //  Pending resident cannot login
    // if (user.role === "RESIDENT" && user.status !== "ACTIVE") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Account not approved yet",
    //   });
    // }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        flat: user.role === "RESIDENT" ? user.flat : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `Account ${user.isActive ? "activated" : "deactivated"}`,
  });
};

// Get all residents
exports.getAllResidents = async (req, res) => {
  try {
    const residents = await User.find({ 
      role: "RESIDENT",
      status: "ACTIVE",
      flat: { $ne: null }
    })
      .populate('flat', 'flatNumber wing')
      .populate({
        path: 'flat',
        populate: {
          path: 'wing',
          select: 'name'
        }
      })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: residents
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch residents",
      error: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('flat', 'flatNumber wing')
      .populate({
        path: 'flat',
        populate: {
          path: 'wing',
          select: 'name'
        }
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let phone = user.phone;
    if (!phone && user.flat) {
      const FlatRequest = require("../models/flatRequest");
      const approvedRequest = await FlatRequest.findOne({
        user: user._id,
        flat: user.flat._id,
        status: "Approved"
      }).sort({ createdAt: -1 });
      
      if (approvedRequest && approvedRequest.contactNumber) {
        phone = approvedRequest.contactNumber;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        phone: phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

// Update old RENTAL or other values to TENANT
exports.updateResidentTypes = async (req, res) => {
  try {
    console.log('Starting update of resident types...');

    // Update both RENTAL and any other potential old values to TENANT
    const result = await User.updateMany(
      { residentType: { $in: ['RENTAL', 'Tenant', 'tenant', 'TENENT'] } },
      { $set: { residentType: 'TENANT' } }
    );

    console.log('Update result:', result);

    return res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} residents to TENANT`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resident types",
      error: error.message
    });
  }
};

// Update resident details
exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, wing, flat, residentType } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    // We don't update password here for security

    // residentType should be OWNER or TENANT
    if (residentType) user.residentType = residentType.toUpperCase();

    await user.save();

    // Populate flat info after save
    const updatedUser = await User.findById(id)
      .populate('flat', 'flatNumber wing')
      .populate({
        path: 'flat',
        populate: {
          path: 'wing',
          select: 'name'
        }
      })
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Resident updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update resident",
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete user request for ID:", id);
    
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id);
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      console.log("User not found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User deleted successfully:", user.name);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
