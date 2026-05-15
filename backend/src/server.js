require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const path     = require('path');

const { connectDB }   = require('./db/database');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes   = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact',   contactRoutes);

const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n  GD Portfolio running at http://localhost:${PORT}\n`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
