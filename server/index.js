const express = require('express');
const app = express();
const {connect} = require("./config/database")
require("dotenv").config();
const authRoutes = require("./routes/auth");

connect();

const PORT = 4000 || process.env.PORT;

app.use(express.json());

// api mounting 
app.use("/api/auth",authRoutes);

app.get("/",(req,res)=>{
    console.log("req is working ")
})

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})