import app from './app.js';
import { sequelize } from './config/database.js';
import SavedMovie from './models/SavedMovies.js'; // Import the SavedMovie model

const PORT = process.env.PORT || 3001;

// Log the model to ensure it's loaded correctly
console.log(SavedMovie === sequelize.models.SavedMovie); // Reference the model directly

// Sync the database and start the server
sequelize
	.sync({ alter: true }) // Automatically alter tables to match the models
	.then(() => {
		console.log('Database synchronized successfully.');

		// Start the server
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
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
