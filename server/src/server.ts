import app from './app.js';
import { sequelize, initDatabase } from './config/database.js';
import SavedMovie from './models/SavedMovies.js';
import { initUserModel } from './models/User.js';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
	try {
		await initDatabase();

		// Initialize models
		initUserModel(sequelize);

		// Log the model to ensure it's loaded correctly
		console.log(SavedMovie === sequelize.models.SavedMovie);

		// Start the server
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer();

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
