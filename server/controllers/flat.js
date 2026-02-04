const Flat = require("../models/Flat");

const Wing = require("../models/Wing");

// Admin create flat

exports.createFlat = async(req,res)=>{


    try {

    const {wingId , flatNumber} = req.body;
    if(!wingId || !flatNumber){
        return res.status(400).json({
            success:false,
            message:'wing ID and flat Number are required'
        })
    }

     
    const block = await Wing.findById(wingId);
     
    if (!block) {
     return res.status(404).json({
      success: false,
      message: "wing not found",
     });
}

    const flat  = await Flat.create({
        wing:wingId,
        flatNumber,
 
    })
   
    return res.status(201).json({
        success:true,
        message:"flat created successfully",
        data:flat,
    })
        
    } 
    catch (error) {
        if (error.code === 11000) {
         return res.status(400).json({
          success: false,
         message: "Flat already exists in this block",
        });
}
          return res.status(500).json({
           success: false,
           message: "Failed to create flat",
  });
    }

  
}

//get flats by block 

exports.getFlatsByBlock = async(req,res)=>{
    console.log(req.params)

    try {
        const {wingId} = req.params;
        if(!wingId ){
            return res.status(400).json({
                success:false,
                message:"wingID required"
            })
        }
        
        const flats = await Flat.find({wing:wingId})
        .populate("currentResident","name email")
        .sort({flatNumber:1});

       

        return res.status(200).json({
            success:true,
            data:flats
        })


        
    } catch (error) {
        return res.status(500).json({
           success: false,
           message: "Failed to fetch flats",
           error:error.message,
        });

    }
}