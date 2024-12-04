import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './utils/movieRoutes.js';
import usersRouter from './routes/users.js';
import { sequelize } from './config/database.js';
import { initUserModel } from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:3001',
			'https://pick-flick-app.netlify.app',
		],
		methods: ['GET', 'POST'],
	})
);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Mount routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', usersRouter);

// Initialize models
initUserModel(sequelize);

// Sync models to the database
sequelize
	.sync()
	.then(() => console.log('Database synced'))
	.catch((err) => console.error('Error syncing database:', err));

export default app;
