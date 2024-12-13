import express, { Request, Response } from 'express';
import SavedMovie from '../models/SavedMovies.js';
import authMiddleware from '../middleware/auth.js';
import { getRandomMovie } from '../controllers/movieController.js'; // Import the random movie controller

const router = express.Router();

// Endpoint to fetch a random movie
router.get('/random', getRandomMovie); // Add the random movie route

// Endpoint to get saved movies for the authenticated user
router.get('/saved', authMiddleware, async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		// Fetch all saved movies, including streaming data
		const savedMovies = await SavedMovie.findAll({
			where: { userId, status: 0 }, // 0 means all saved movies
			attributes: [
				'movieId',
				'title',
				'poster',
				'genres',
				'releaseYear',
				'synopsis',
				'runtime',
				'cast',
				'directors',
				'producers',
				'streaming',
			],
		});

		res.json(savedMovies);
	} catch (error) {
		console.error('Error fetching saved movies:', error);
		res.status(500).json({ message: 'Failed to fetch saved movies.' });
	}
});

// Endpoint to save a movie for the authenticated user
router.post('/save', authMiddleware, async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const {
		movieId,
		title,
		poster,
		genres,
		releaseYear,
		synopsis,
		runtime,
		cast,
		directors,
		producers,
		streaming,
	} = req.body;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		// Check if the movie already exists for the user
		const existingMovie = await SavedMovie.findOne({
			where: { userId, movieId },
		});
		if (existingMovie) {
			return res.status(400).json({ message: 'Movie already saved.' });
		}

		// Save the movie to the database
		const newMovie = await SavedMovie.create({
			userId,
			movieId,
			title,
			poster,
			genres,
			releaseYear,
			synopsis,
			runtime,
			cast,
			directors,
			producers,
			streaming,
		});

		res.status(201).json({
			message: 'Movie saved successfully.',
			movie: newMovie,
		});
	} catch (error) {
		console.error('Error saving movie:', error);
		res.status(500).json({ message: 'Failed to save movie.' });
	}
});

// Endpoint to delete a saved movie for the authenticated user
router.delete(
	'/saved/:movieId',
	authMiddleware,
	async (req: Request, res: Response) => {
		const userId = req.user?.id;
		const { movieId } = req.params;

		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		try {
			// Find the saved movie for this user and delete it
			const deleted = await SavedMovie.destroy({
				where: { userId, movieId },
			});

			if (deleted) {
				return res
					.status(200)
					.json({ message: 'Movie deleted successfully.' });
			} else {
				return res.status(404).json({ message: 'Movie not found.' });
			}
		} catch (error) {
			console.error('Error deleting movie:', error);
			res.status(500).json({ message: 'Failed to delete movie.' });
		}
	}
);

// Endpoint to save a watched movie for the authenticated user
router.put('/watched', authMiddleware, async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { movieId, status } = req.body;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		// Check if the movie already exists for the user
		const existingMovie = await SavedMovie.findOne({
			where: { userId, movieId },
		});
		if (!existingMovie) {
			return res.status(404).json({ message: 'Movie not found' });
		}

		existingMovie.status = status; // Set the status to 1 for watched
		await existingMovie.save();
		res.status(200).json({
			message: 'Movie marked as watched successfully.',
			movie: existingMovie,
		});
	} catch (error) {
		console.error('Error saving movie:', error);
		res.status(500).json({ message: 'Failed to save movie.' });
	}
});

// Endpoint to get saved movies for the authenticated user
router.get('/watched', authMiddleware, async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		// Fetch all saved movies, including streaming data
		const savedMovies = await SavedMovie.findAll({
			where: { userId, status: 1 }, // 1 means all watched movies
			attributes: [
				'movieId',
				'title',
				'poster',
				'genres',
				'releaseYear',
				'synopsis',
				'runtime',
				'cast',
				'directors',
				'producers',
				'streaming',
			],
		});

		res.json(savedMovies);
	} catch (error) {
		console.error('Error fetching saved movies:', error);
		res.status(500).json({ message: 'Failed to fetch saved movies.' });
	}
});

export default router;
