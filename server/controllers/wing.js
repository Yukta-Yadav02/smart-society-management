const Wing = require("../models/Wing");

exports.createWing = async(req, res)=>{
    const {name}  = req.body;

    if(!name){
        return res.status(400).json({
            success:false,
            message:"required fields"
        })
    }

    const exists = await Wing.findOne({name});

    if(exists){
        return res.status(400).json({
            success:false,
            message:"Wing already exist"
        })
    }

    const wing = await Wing.create({name});
   

    res.status(201).json({
        success:true,
        message:"Wing created successfully",
        data:wing,
    })

}
exports.getWings = async(req,res)=>{

    try {
         const Wings = await Wing.find();


         return   res.status(200).json({
                  success:true,
                  message:"wings fetch ",
                   data:Wings,
             })
        
    } catch (error) {

        return res.status(500).json({
            success:false,
            message:"wings not fetch",
            error:error.message
        })
        
    }
   
}