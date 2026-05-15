require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const portfolioData = require('../data/portfolioData');
const Portfolio = require('../models/Portfolio');

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gdportfolio';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Portfolio.deleteMany({});
  await Portfolio.create(portfolioData);
  console.log('Portfolio data seeded successfully');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
