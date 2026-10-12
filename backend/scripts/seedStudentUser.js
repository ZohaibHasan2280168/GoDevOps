const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const studentUsers = [
  {
    name: 'DevOps Cadet',
    email: 'devops@cyberverse.com',
    password: 'Password@123',
    role: 'user',
    twoFactorEnabled: false
  },
  {
    name: 'DevOps Engineer',
    email: 'devops@godevops.com',
    password: 'Password@123',
    role: 'user',
    twoFactorEnabled: false
  },
  {
    name: 'GoDevOps Student',
    email: 'student@godevops.com',
    password: 'Password@123',
    role: 'user',
    twoFactorEnabled: false
  }
];

async function seedStudents() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/godevops';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    for (const userData of studentUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User already exists: ${userData.email}, resetting password...`);
        existing.password = userData.password;
        existing.twoFactorEnabled = false;
        existing.role = 'user';
        await existing.save();
        console.log(`✅ Updated: ${userData.email}`);
      } else {
        const newUser = new User(userData);
        await newUser.save();
        console.log(`✅ Created: ${userData.email}`);
      }
    }

    console.log('\n🎉 Successfully seeded student accounts into godevops database!');
  } catch (error) {
    console.error('❌ Error seeding student accounts:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

seedStudents();
