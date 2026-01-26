const express = require('express');
const app = express();
const {connect} = require("./config/database")
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const wingRoutes = require("./routes/Wing")

connect();

const PORT = 4000 || process.env.PORT;

app.use(express.json());
app.use(cookieParser())

// api mounting 
app.use("/api/auth",authRoutes);
app.use("/api/wing",wingRoutes)

app.get("/",(req,res)=>{
    console.log("req is working ")
})

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})