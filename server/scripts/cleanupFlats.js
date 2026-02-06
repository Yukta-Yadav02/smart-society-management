const mongoose = require('mongoose');
const Flat = require('../models/Flat');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/smart-society', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const cleanupFlats = async () => {
    try {
        console.log('Starting flat cleanup...');
        
        const flats = await Flat.find();
        
        for (let flat of flats) {
            let needsUpdate = false;
            let updateData = {};
            
            // Check if currentResident exists in User collection
            if (flat.currentResident) {
                const userExists = await User.findById(flat.currentResident);
                if (!userExists) {
                    console.log(`Flat ${flat.flatNumber}: Removing invalid currentResident`);
                    updateData.currentResident = null;
                    updateData.isOccupied = false;
                    updateData.resident = null;
                    needsUpdate = true;
                }
            }
            
            // If flat is marked occupied but has no currentResident, fix it
            if (flat.isOccupied && !flat.currentResident) {
                console.log(`Flat ${flat.flatNumber}: Fixing occupied flag without resident`);
                updateData.isOccupied = false;
                updateData.resident = null;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await Flat.findByIdAndUpdate(flat._id, updateData);
                console.log(`Flat ${flat.flatNumber}: Updated successfully`);
            }
        }
        
        console.log('Flat cleanup completed!');
        process.exit(0);
        
    } catch (error) {
        console.error('Cleanup error:', error);
        process.exit(1);
    }
};

cleanupFlats();