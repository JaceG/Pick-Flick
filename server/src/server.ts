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
		console.log('Environment:', process.env.NODE_ENV);
		console.log('Port:', PORT);

		const server = http.createServer(app);

		await new Promise<void>((resolve, reject) => {
			server.listen(PORT, '0.0.0.0', () => {
				const addr = server.address();
				console.log('=================================');
				console.log(`Server running at: http://0.0.0.0:${PORT}`);
				console.log('Server address:', addr);
				console.log('Environment:', process.env.NODE_ENV);
				console.log('=================================');
				resolve();
			});

			server.on('error', (error) => {
				console.error('Server failed to start:', error);
				reject(error);
			});
		});
	} catch (error) {
		console.error('Fatal server error:', error);
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
