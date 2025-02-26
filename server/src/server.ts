import app from './app.js';
import { sequelize } from './config/database.js';
import SavedMovie from './models/SavedMovies.js'; // Import the SavedMovie model

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

// Add startup phases logging
console.log('Starting server initialization...');

// Test database connection
sequelize
	.authenticate()
	.then(() => {
		console.log('Database connection established.');
		return sequelize.sync();
	})
	.then(() => {
		console.log('Database synchronized.');
		app.listen(PORT, '0.0.0.0', () => {
			console.log('=================================');
			console.log(`Server running on port ${PORT}`);
			console.log(`Environment: ${process.env.NODE_ENV}`);
			console.log('=================================');
		});
	})
	.catch((error) => {
		console.error('Server initialization failed:', error);
		process.exit(1);
	});

// Handle uncaught exceptions and rejections for better error handling
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
