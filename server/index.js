const express = require('express');
const app = express();
const {connect} = require("./config/database")
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const wingRoutes = require("./routes/Wing")
const flatRoutes = require("./routes/flat");
const flatRequestRoutes = require("./routes/flatRequest")
const complaint = require("./routes/Complaint");
const noticeRoutes = require("./routes/Notice");


connect();

const PORT = 4000 || process.env.PORT;

app.use(express.json());
app.use(cookieParser())

// api mounting 
app.use("/api/auth",authRoutes);
app.use("/api/wing",wingRoutes);
app.use("/api/flat",flatRoutes);
app.use("/api/",flatRequestRoutes);
app.use("/api/",complaint);
app.use("/api/notice",noticeRoutes);

app.get("/",(req,res)=>{
    console.log("req is working ")
})

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})