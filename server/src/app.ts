import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movies.js';
import usersRouter from './routes/users.js';
import { sequelize } from './config/database.js';
import { initUserModel } from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(express.static('../client/dist'));
app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:3001',
			'https://pick-flick.onrender.com/',
		],
		methods: ['GET', 'POST', 'DELETE'], // Add DELETE method
	})
);
app.use(express.json()); // Parse incoming JSON requests

// Log incoming requests (for debugging)
app.use((req, res, next) => {
	console.log(`[${req.method}] ${req.url}`);
	next();
});

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Mount routes
app.use('/api/movies', movieRoutes); // Movie-related routes
app.use('/api/users', usersRouter); // User-related routes

// Initialize models
initUserModel(sequelize);

// Sync models to the database
sequelize
	.sync({ alter: true }) // Automatically alter tables to match the models
	.then(() => console.log('Database synced successfully.'))
	.catch((err) => console.error('Error syncing database:', err));

// Global error handler for unexpected errors
app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error('Unhandled Error:', err);
		res.status(500).json({ message: 'An unexpected error occurred.' });
	}
);

export default app;
