import app from './app.js';
import { sequelize } from './config/database.js';
import SavedMovie from './models/SavedMovies.js'; // Import the SavedMovie model

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

// Log the model to ensure it's loaded correctly
console.log(SavedMovie === sequelize.models.SavedMovie); // Reference the model directly

// Sync the database and start the server
sequelize
	.sync()
	.then(() => {
		console.log('Database synchronized successfully.');

		// Start the server
		app.listen(PORT, '0.0.0.0', () => {
			console.log(`Server running on http://0.0.0.0:${PORT}`);
			console.log('Environment:', process.env.NODE_ENV || 'development');
		});
	})
	.catch((error) => {
		console.error('Error synchronizing the database:', error);

		// Exit the process if the database connection fails
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
