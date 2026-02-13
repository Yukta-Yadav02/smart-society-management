// Script to fix user status - Only users with approved flat requests should be ACTIVE
const mongoose = require('mongoose');
const User = require('../models/User');
const FlatRequest = require('../models/flatRequest');
require('dotenv').config();

const fixUserStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    const activeResidents = await User.find({ 
      role: 'RESIDENT', 
      status: 'ACTIVE' 
    });

    console.log(`Found ${activeResidents.length} ACTIVE residents`);

    let fixedCount = 0;

    for (const user of activeResidents) {
      const approvedRequest = await FlatRequest.findOne({
        user: user._id,
        status: 'Approved'
      });

      if (!approvedRequest) {
        await User.findByIdAndUpdate(user._id, { status: 'PENDING' });
        console.log(`Fixed: ${user.name} - Set to PENDING`);
        fixedCount++;
      }
    }

    console.log(`\nFixed ${fixedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserStatus();
