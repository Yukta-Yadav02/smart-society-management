const express = require('express');
const app = express();
require('dotenv').config();

const {connect} = require('./config/database')

const PORT = 4000 || process.env.PORT;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

connect();
app.use(express.json());



app.listen(PORT,()=>{
    console.log(`server is running${PORT}`);
})