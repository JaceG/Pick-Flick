import app from './app.js';
import { sequelize } from './config/database.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

// Remove database initialization from database.ts (lines 22-39)
// and consolidate here
async function startServer() {
	try {
		console.log('Starting server initialization...');

		// Test database connection
		await sequelize.authenticate();
		console.log('Database connection established.');

		// Sync database
		await sequelize.sync();
		console.log('Database synchronized.');

		// Start server
		app.listen(PORT, '0.0.0.0', () => {
			console.log('=================================');
			console.log(`Server running on port ${PORT}`);
			console.log(`Environment: ${process.env.NODE_ENV}`);
			console.log('=================================');
		});
	} catch (error) {
		console.error('Server initialization failed:', error);
		process.exit(1);
	}
}

startServer();

// Error handlers
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
