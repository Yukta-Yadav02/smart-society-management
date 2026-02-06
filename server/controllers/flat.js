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

// Assign flat to resident
exports.assignFlat = async (req, res) => {
    try {
        const { flatId, residentId } = req.body;
        
        if (!flatId || !residentId) {
            return res.status(400).json({
                success: false,
                message: "Flat ID and Resident ID are required"
            });
        }

        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({
                success: false,
                message: "Flat not found"
            });
        }

        if (flat.isOccupied) {
            return res.status(400).json({
                success: false,
                message: "Flat is already occupied"
            });
        }

        const updatedFlat = await Flat.findByIdAndUpdate(
            flatId,
            {
                isOccupied: true,
                currentResident: residentId
            },
            { new: true }
        ).populate("currentResident", "name email");

        return res.status(200).json({
            success: true,
            message: "Flat assigned successfully",
            data: updatedFlat
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to assign flat",
            error: error.message
        });
    }
};

// Vacate flat
exports.vacateFlat = async (req, res) => {
    try {
        const { flatId } = req.params;
        
        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({
                success: false,
                message: "Flat not found"
            });
        }

        const updatedFlat = await Flat.findByIdAndUpdate(
            flatId,
            {
                isOccupied: false,
                currentResident: null,
                resident: null
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Flat vacated successfully",
            data: updatedFlat
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to vacate flat",
            error: error.message
        });
    }
};

// Get all flats
exports.getAllFlats = async (req, res) => {
    try {
        const flats = await Flat.find()
            .populate("wing", "name")
            .populate("currentResident", "name email")
            .sort({ createdAt: -1 });

        // Add resident data to each flat for proper display
        const flatsWithResidentData = flats.map(flat => {
            const flatObj = flat.toObject();
            
            if (flatObj.currentResident) {
                flatObj.resident = {
                    _id: flatObj.currentResident._id,
                    name: flatObj.currentResident.name,
                    email: flatObj.currentResident.email
                };
            }
            return flatObj;
        });

        return res.status(200).json({
            success: true,
            data: flatsWithResidentData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch flats",
            error: error.message
        });
    }
};

// Update old requests to OWNER
exports.updateOldRequests = async (req, res) => {
    try {
        const FlatRequest = require('../models/FlatRequest');
        
        console.log('Starting update of old requests...');
        
        const result = await FlatRequest.updateMany(
            { ownershipType: 'RESIDENT' },
            { $set: { ownershipType: 'OWNER' } }
        );
        
        console.log('Update result:', result);
        
        return res.status(200).json({
            success: true,
            message: `Updated ${result.modifiedCount} requests to OWNER`,
            modifiedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update requests",
            error: error.message
        });
    }
};