import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

// Middleware setup
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
	console.log(`[${req.method}] ${req.url}`);
	next();
});

// Serve static files from the React build folder
const staticPath = path.resolve(__dirname, '../../client/dist');
console.log('Static files path:', staticPath);

// Ensure the directory exists
if (fs.existsSync(staticPath)) {
	app.use(express.static(staticPath));
} else {
	console.error('Static files path does not exist:', staticPath);
}

// Configure CORS
app.use(
	cors({
		origin: [
			'https://pick-flick.onrender.com',
			'https://www.pickflick.app',
			'http://localhost:3000',
			'http://localhost:3001',
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Mount API routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', usersRouter);

// Initialize models
initUserModel(sequelize);

// Fallback route for React
const fallbackPath = path.resolve(staticPath, 'index.html');
console.log('Fallback path:', fallbackPath);

app.get('*', (req, res) => {
	if (fs.existsSync(fallbackPath)) {
		res.sendFile(fallbackPath);
	} else {
		console.error('Fallback file does not exist:', fallbackPath);
		res.status(404).send('Fallback file not found');
	}
});

// Global error handler
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err.stack);
	res.status(500).json({ message: 'An unexpected error occurred.' });
});

export default app;
