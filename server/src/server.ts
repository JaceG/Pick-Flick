import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import { initUserModel } from './models/User.js'; // Import model initialization
import usersRouter from './routes/users.js'; // Import user routes

dotenv.config(); // Load environment variables from .env file

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:1313@localhost:5432/pick_flick',
  {
    logging: console.log, // Enable logging for debugging (optional)
    dialect: 'postgres',  // Specify the dialect
  }
);

// Initialize models
initUserModel(sequelize);

// Sync models to the database
sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database:', err));

const app = express();

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Mount user routes
app.use('/api/users', usersRouter); // Connect the user routes to the /api/users path

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
