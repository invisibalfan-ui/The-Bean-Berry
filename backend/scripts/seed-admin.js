// scripts/seed-admin.js
// One-time script to seed an admin user into the database.
// Usage: npm run seed:admin (from the backend directory)

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('Error: MONGO_URL is not defined in environment variables.');
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected.');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const result = await User.findOneAndUpdate(
      { username: 'admin' },
      {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin user seeded successfully (id: ${result._id}).`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected. Done.');
    process.exit(0);
  }
}

seedAdmin();
