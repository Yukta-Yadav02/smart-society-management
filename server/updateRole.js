const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function updateUserRole() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to database');
    
    const user = await User.findOneAndUpdate(
      { email: 'sawariya@gmail.com' },
      { role: 'ADMIN', status: 'ACTIVE' },
      { new: true }
    );
    
    if (user) {
      console.log('User updated successfully:', user);
    } else {
      console.log('User not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

updateUserRole();