require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./database/models');

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./modules/v1/auth/routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

// Database connection
db.sequelize
  .authenticate()
  .then(() => console.log('Database Connected...'))
  .catch((err) => console.error('Connection Failed..', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
