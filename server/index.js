const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const wingRoutes = require("./routes/Wing");
const flatRoutes = require("./routes/flat");
const flatRequestRoutes = require("./routes/flatRequest");
const complaint = require("./routes/Complaint");
const noticeRoutes = require("./routes/Notice");
const maintenanceRoutes = require("./routes/Maintenance");
const visitorRoutes = require("./routes/Visitor");
const dashboardRoutes = require("./routes/Dashboard");

connect();

const PORT = process.env.PORT || 4000;

/* ================= CORS SETUP ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-society-management.vercel.app",
    
    ],
    credentials: true,
  })
);



/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/wing", wingRoutes);
app.use("/api/flat", flatRoutes);
app.use("/api/", flatRequestRoutes);
app.use("/api/", complaint);
app.use("/api/notice", noticeRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
