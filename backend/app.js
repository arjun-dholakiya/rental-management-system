require('dotenv').config();
const express = require('express');
const app = express();

const db = require('./database/models');

app.use(express.json());

db.sequelize
  .authenticate()
  .then(() => console.log('Database Connected...'))
  .catch((err) => console.error('Connection Failed..', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
