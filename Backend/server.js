require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db/dbHelper');
const foodController = require('./controllers/foodController');

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const logRoutes = require('./routes/logRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Terjadi kesalahan internal pada server.' });
});

// Boot Server
async function startServer() {
  try {
    console.log('Initializing local database...');
    await initDb();
    
    console.log('Parsing and loading food dataset (final_dataset.csv)...');
    await foodController.loadFoodsCSV();
    
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`  NutriSi Express API Server Running on port ${PORT}`);
      console.log(`  Endpoint: http://localhost:${PORT}`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
