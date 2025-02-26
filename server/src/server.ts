import app from './app.js';
import { sequelize } from './config/database.js';
import http from 'http';

// Ensure PORT is always a number and defaults to 10000
const PORT = Number(process.env.PORT) || 10000;

// Remove database initialization from database.ts (lines 22-39)
// and consolidate here
async function startServer() {
	try {
		console.log('Starting server initialization...');
		console.log('Attempting to bind to port:', PORT);
		console.log('Environment:', process.env.NODE_ENV);

		// Create HTTP server
		const server = http.createServer(app);

		// Test database connection
		await sequelize.authenticate();
		console.log('Database connection established.');

		// Sync database
		await sequelize.sync();
		console.log('Database synchronized.');

		// Bind to all network interfaces (0.0.0.0)
		await new Promise((resolve, reject) => {
			server.listen(PORT, '0.0.0.0', () => {
				const addr = server.address();
				console.log('=================================');
				console.log(`Server is bound to port ${PORT}`);
				console.log('Server address:', addr);
				console.log('=================================');
				resolve(true);
			});

			server.on('error', (error: NodeJS.ErrnoException) => {
				console.error('Server startup error:', error);
				reject(error);
			});
		});
	} catch (error) {
		console.error('Server initialization failed:', error);
		process.exit(1);
	}
}

// Start server with error handling
startServer().catch((error) => {
	console.error('Fatal server error:', error);
	process.exit(1);
});

// Error handlers
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
