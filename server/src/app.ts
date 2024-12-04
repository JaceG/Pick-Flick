import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import movieRoutes from './routes/movies.js';
import usersRouter from './routes/users.js';
import { sequelize } from './config/database.js';
import { initUserModel } from './models/User.js';

// Load environment variables
dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware setup
app.use(express.json());

// Serve static files from the React build folder
app.use(express.static(path.resolve(__dirname, '../client/dist')));

// Configure CORS
app.use(
	cors({
		origin: '*', // Allow all origins (frontend and backend share the same domain)
		methods: ['GET', 'POST', 'DELETE'],
	})
);

// Log incoming requests for debugging
app.use((req, res, next) => {
	console.log(`[${req.method}] ${req.url}`);
	next();
});

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Mount API routes
app.use('/api/movies', movieRoutes); // Movie-related routes
app.use('/api/users', usersRouter); // User-related routes

// Initialize models
initUserModel(sequelize);

// Sync database (use migrations in production if possible)
sequelize
	.sync() // Avoid `alter: true` in production
	.then(() => console.log('Database synced successfully.'))
	.catch((err) => console.error('Error syncing database:', err));

// Fallback route for React
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err.stack);
	res.status(500).json({ message: 'An unexpected error occurred.' });
});

export default app;
