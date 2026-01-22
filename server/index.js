const express = require('express');

const app = express();


app.get("/",(req,res)=>{
    console.log("req is working ")
})

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})