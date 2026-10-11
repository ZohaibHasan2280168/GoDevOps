const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetUserPoints = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Reset all users to 0 points, level 1, and clear progress
    const result = await User.updateMany(
      { role: 'user' }, // Only update regular users, not admins
      {
        $set: {
          points: 0,
          level: 1,
          completedLabs: 0,
          completedRooms: 0,
          labProgress: [],
          roomProgress: []
        }
      }
    );

    console.log(`✅ Reset ${result.modifiedCount} users to 0 points`);
    
  } catch (error) {
    console.error('❌ Error resetting user points:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

resetUserPoints();