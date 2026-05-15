const Portfolio = require('../models/Portfolio');

async function getAll(_req, res) {
  const doc = await Portfolio.findOne().lean();
  if (!doc) return res.status(404).json({ success: false, message: 'Portfolio data not found.' });
  const { _id, __v, createdAt, updatedAt, ...data } = doc;
  res.json({ success: true, data });
}

async function getSection(req, res) {
  const { section } = req.params;
  const doc = await Portfolio.findOne().lean();
  if (!doc || !doc[section]) {
    return res.status(404).json({ success: false, message: `Section "${section}" not found.` });
  }
  res.json({ success: true, data: doc[section] });
}

module.exports = { getAll, getSection };
