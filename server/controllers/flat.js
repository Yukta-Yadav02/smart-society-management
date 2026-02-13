const Flat = require("../models/Flat");

const Wing = require("../models/Wing");
const User = require("../models/User"); // [OWNERSHIP FLOW] - Need User model for ownership assignment

// Admin create flat

exports.createFlat = async (req, res) => {


    try {
        const { wingId, flatNumber, kitchen } = req.body;
        if (!wingId || !flatNumber) {
            return res.status(400).json({
                success: false,
                message: 'wing ID and flat Number are required'
            })
        }

        const block = await Wing.findById(wingId);

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "wing not found",
            });
        }

        // Owner assignment logic
        let finalOwnerId = null;
        const { ownerName } = req.body;

        if (ownerName && ownerName.trim()) {
            let ownerUser = await User.findOne({
                name: { $regex: `^${ownerName.trim()}$`, $options: 'i' },
                role: "ADMIN"
            });
            
            if (!ownerUser) {
                ownerUser = await User.create({
                    name: ownerName.trim(),
                    email: `${ownerName.trim().toLowerCase().replace(/\s+/g, '')}@society.com`,
                    password: 'password123',
                    role: 'ADMIN',
                    status: 'ACTIVE'
                });
            }
            
            finalOwnerId = ownerUser._id;
        } else {
            finalOwnerId = req.user.id;
        }

        const flat = await Flat.create({
            wing: wingId,
            flatNumber,
            kitchen: kitchen || "1",
            owner: finalOwnerId
        })

        return res.status(201).json({
            success: true,
            message: "flat created successfully",
            data: flat,
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

exports.getFlatsByBlock = async (req, res) => {
    console.log(req.params)

    try {
        const { wingId } = req.params;

        if (!wingId) {
            return res.status(400).json({
                success: false,
                message: "wingID required"
            })
        }

        const flats = await Flat.find({ wing: wingId })
            .populate("currentResident", "name email residentType") // [OWNERSHIP FLOW] - Added residentType
            .populate("owner", "name email")
            .sort({ flatNumber: 1 });



        return res.status(200).json({
            success: true,
            data: flats
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch flats",
            error: error.message,
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

        // [OWNERSHIP FLOW] - Find resident to check their type
        const resident = await User.findById(residentId);
        if (!resident) {
            return res.status(404).json({
                success: false,
                message: "Resident not found"
            });
        }

        const updateData = {
            isOccupied: true,
            currentResident: residentId,
            resident: {
                _id: resident._id,
                name: resident.name,
                email: resident.email
            }
        };

        // Agar Resident khud Owner hai, toh Flat ka owner wahi ban jayega
        if (resident.residentType === "OWNER") {
            updateData.owner = resident._id;
        }
        // Agar Resident Tenant hai, toh Flat ka owner purana hi rahega (e.g., Ram)

        const updatedFlat = await Flat.findByIdAndUpdate(
            flatId,
            updateData,
            { new: true }
        ).populate("currentResident", "name email").populate("owner", "name email");

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
            .populate("currentResident", "name email residentType") // [OWNERSHIP FLOW] - Added residentType
            .populate("owner", "name email")
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

// [OWNERSHIP FLOW] - Database ke hisaab se sahi Malik (Owner) assign karna
exports.initializeOwnership = async (req, res) => {
    try {
        const admin = await User.findOne({ role: "ADMIN" });
        const wings = await Wing.find({});

        let residentsUpdated = 0;
        let fallbackUpdated = 0;
        const assignmentSummary = [];

        // 1. Sabse pehle un logo ko Owner banao jo 'OWNER' type ke residents hain (Real Owners like Saloni)
        const ownerResidents = await User.find({ residentType: "OWNER", flat: { $ne: null } });
        for (const resident of ownerResidents) {
            const result = await Flat.findByIdAndUpdate(resident.flat, { owner: resident._id });
            if (result) residentsUpdated++;
        }

        // 2. Ab baki bache flats ke liye Wing-wise default malik set karo
        for (const wing of wings) {
            const wingName = wing.name.toUpperCase();
            let targetName = "";

            if (wingName.endsWith('A')) targetName = "Ram";
            else if (wingName.endsWith('B')) targetName = "Riya";
            else if (wingName.endsWith('C')) targetName = "Priya";
            else if (wingName.endsWith('D')) targetName = "Himanshu";

            if (targetName) {
                // Check if this owner already exists
                let targetUser = await User.findOne({
                    name: { $regex: targetName, $options: 'i' }
                });

                // Agar nahi hai, toh Admin role ke saath create karo (System Default)
                if (!targetUser) {
                    targetUser = await User.create({
                        name: targetName,
                        email: `${targetName.toLowerCase()}@society.com`,
                        password: "password123", // Dummy password
                        role: "ADMIN",
                        status: "ACTIVE"
                    });
                    console.log(`👤 System User Created: ${targetName}`);
                }

                // Ab un flats ko assign karo jinka malik null hai
                const result = await Flat.updateMany(
                    { wing: wing._id, owner: null },
                    { $set: { owner: targetUser._id } }
                );

                fallbackUpdated += result.modifiedCount;
                assignmentSummary.push({ wing: wing.name, owner: targetUser.name, count: result.modifiedCount });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Ownership Initialization Complete!",
            summary: assignmentSummary,
            residentsUpdated,
            fallbackUpdated
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to initialize ownership",
            error: error.message
        });
    }
};

// Update old requests to OWNER
exports.updateOldRequests = async (req, res) => {
    try {
        const FlatRequest = require('../models/flatRequest');

        const result = await FlatRequest.updateMany(
            { ownershipType: 'RESIDENT' },
            { $set: { ownershipType: 'OWNER' } }
        );

        return res.status(200).json({
            success: true,
            message: `Updated ${result.modifiedCount} requests to OWNER`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update requests",
            error: error.message
        });
    }
};

// Delete flat
exports.deleteFlat = async (req, res) => {
    try {
        const { flatId } = req.params;

        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({
                success: false,
                message: "Flat not found"
            });
        }

        await Flat.findByIdAndDelete(flatId);

        return res.status(200).json({
            success: true,
            message: "Flat deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete flat",
            error: error.message
        });
    }
};

exports.getOwners = async (req, res) => {
    try {
        const defaultOwners = [
            { name: 'Ram', email: 'ram@society.com' },
            { name: 'Riya', email: 'riya@society.com' },
            { name: 'Priya', email: 'priya@society.com' },
            { name: 'Himanshu', email: 'himanshu@society.com' }
        ];

        for (const ownerData of defaultOwners) {
            const exists = await User.findOne({ email: ownerData.email });
            if (!exists) {
                await User.create({
                    name: ownerData.name,
                    email: ownerData.email,
                    password: 'password123',
                    role: 'ADMIN',
                    status: 'ACTIVE'
                });
            }
        }

        const owners = await User.find({ 
            email: { $in: ['ram@society.com', 'riya@society.com', 'priya@society.com', 'himanshu@society.com'] }
        }).select("name email");
        
        return res.status(200).json({
            success: true,
            data: owners
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch owners",
            error: error.message
        });
    }
};