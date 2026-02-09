const mongoose = require('mongoose');
const Flat = require('../models/Flat');
const User = require('../models/User');

mongoose.connect('mongodb+srv://sawariyadixit085:dixit@cluster0.xlo7ktx.mongodb.net/MEGA')
  .then(async () => {
    console.log('🔒 Enforcing: One Resident Per Flat\n');

    const flats = await Flat.find({});
    let fixed = 0;

    for (const flat of flats) {
      const residents = await User.find({ flat: flat._id, status: 'ACTIVE' });
      
      if (residents.length > 1) {
        console.log(`⚠️  ${flat.flatNumber}: ${residents.length} residents!`);
        
        // Keep most recent
        const sorted = residents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const keep = sorted[0];
        
        // Remove others
        for (let i = 1; i < sorted.length; i++) {
          await User.findByIdAndUpdate(sorted[i]._id, { 
            flat: null,
            status: 'PENDING'
          });
          console.log(`   ❌ Removed: ${sorted[i].name}`);
        }
        
        // Sync flat
        await Flat.findByIdAndUpdate(flat._id, {
          isOccupied: true,
          currentResident: keep._id,
          resident: {
            _id: keep._id,
            name: keep.name,
            email: keep.email
          }
        });
        
        console.log(`   ✅ Kept: ${keep.name}\n`);
        fixed++;
      } else if (residents.length === 1) {
        // Sync flat data
        await Flat.findByIdAndUpdate(flat._id, {
          isOccupied: true,
          currentResident: residents[0]._id,
          resident: {
            _id: residents[0]._id,
            name: residents[0].name,
            email: residents[0].email
          }
        });
      } else if (residents.length === 0) {
        // Check if flat shows occupied but no resident
        if (flat.isOccupied) {
          await Flat.findByIdAndUpdate(flat._id, {
            isOccupied: false,
            currentResident: null,
            resident: null
          });
          console.log(`🧹 Cleaned: ${flat.flatNumber} (was marked occupied but no resident)`);
          fixed++;
        }
      }
    }

    console.log(`\n✅ Fixed ${fixed} flats`);
    console.log('✅ One resident per flat enforced!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
