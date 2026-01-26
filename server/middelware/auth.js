const jwt = require("jsonwebtoken");

/* =========================
   PROTECT MIDDLEWARE
========================= */
exports.protect = (req, res, next) => {
  console.log(req.body)
  try {
    const token = req.cookies.token ||
                  req.body.token ||
                  req.header("Authorization")?.replace("Bearer", "");

                  console.log(token)

                  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};

/* =========================
   ROLE BASED AUTH
========================= */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
