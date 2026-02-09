const mongoose = require('mongoose');
const Flat = require('../models/Flat');
const User = require('../models/User');

mongoose.connect('mongodb+srv://sawariyadixit085:dixit@cluster0.xlo7ktx.mongodb.net/MEGA')
  .then(async () => {
    console.log('🔧 Starting cleanup...\n');

    const flats = await Flat.find({});
    
    for (const flat of flats) {
      const residents = await User.find({ flat: flat._id, status: 'ACTIVE' });
      
      if (residents.length > 1) {
        console.log(`⚠️  ${flat.flatNumber}: ${residents.length} residents found!`);
        residents.forEach(r => console.log(`   - ${r.name} (${r.residentType})`));
        
        // Keep only the most recent one
        const sorted = residents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const keepResident = sorted[0];
        
        console.log(`   ✅ Keeping: ${keepResident.name}`);
        
        // Remove others
        for (let i = 1; i < sorted.length; i++) {
          await User.findByIdAndUpdate(sorted[i]._id, { 
            flat: null,
            status: 'PENDING'
          });
          console.log(`   ❌ Removed: ${sorted[i].name}`);
        }
        
        // Update flat
        await Flat.findByIdAndUpdate(flat._id, {
          isOccupied: true,
          currentResident: keepResident._id,
          resident: {
            _id: keepResident._id,
            name: keepResident.name,
            email: keepResident.email
          }
        });
        console.log('');
      } else if (residents.length === 1) {
        // Sync flat status
        await Flat.findByIdAndUpdate(flat._id, {
          isOccupied: true,
          currentResident: residents[0]._id,
          resident: {
            _id: residents[0]._id,
            name: residents[0].name,
            email: residents[0].email
          }
        });
      } else {
        // No residents - mark vacant
        await Flat.findByIdAndUpdate(flat._id, {
          isOccupied: false,
          currentResident: null,
          resident: null
        });
      }
    }

    console.log('✅ Cleanup complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
