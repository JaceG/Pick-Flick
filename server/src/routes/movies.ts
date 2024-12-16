import express, { Request, Response } from 'express';
import SavedMovie from '../models/SavedMovies.js';
import authMiddleware from '../middleware/auth.js';
import {
	getRandomMovie,
	getRandomMovieByStreaming,
} from '../controllers/movieController.js';

const router = express.Router();

// Public endpoints
router.get('/random', getRandomMovie);
router.get('/random-streaming', getRandomMovieByStreaming);

// Protected endpoints
router.get('/saved', authMiddleware, async (req: Request, res: Response) => {
	res.header('Content-Type', 'application/json');
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const savedMovies = await SavedMovie.findAll({
			where: { userId, status: 0 },
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

router.post('/save', authMiddleware, async (req: Request, res: Response) => {
	res.header('Content-Type', 'application/json');
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
		const existingMovie = await SavedMovie.findOne({
			where: { userId, movieId },
		});

		if (existingMovie) {
			return res.status(400).json({ message: 'Movie already saved.' });
		}

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
			status: 0,
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

router.delete(
	'/saved/:movieId',
	authMiddleware,
	async (req: Request, res: Response) => {
		res.header('Content-Type', 'application/json');
		const userId = req.user?.id;
		const { movieId } = req.params;

		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		try {
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

router.put('/watched', authMiddleware, async (req: Request, res: Response) => {
	res.header('Content-Type', 'application/json');
	console.log('Received PUT request to /api/movies/watched');
	console.log('Request headers:', req.headers);
	console.log('Request body:', req.body);

	const userId = req.user?.id;
	const { movieId, status } = req.body;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const existingMovie = await SavedMovie.findOne({
			where: { userId, movieId },
		});

		if (!existingMovie) {
			return res.status(404).json({ message: 'Movie not found' });
		}

		existingMovie.status = status;
		await existingMovie.save();

		res.status(200).json({
			message: 'Movie marked as watched successfully.',
			movie: existingMovie,
		});
	} catch (error) {
		console.error('Error updating movie status:', error);
		if (error instanceof Error) {
			res.status(500).json({
				message: 'Failed to update movie status.',
				error: error.message,
			});
		} else {
			res.status(500).json({
				message: 'Failed to update movie status.',
				error: 'Unknown error occurred',
			});
		}
	}
});

router.get('/watched', authMiddleware, async (req: Request, res: Response) => {
	res.header('Content-Type', 'application/json');
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const watchedMovies = await SavedMovie.findAll({
			where: { userId, status: 1 },
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

		res.json(watchedMovies);
	} catch (error) {
		console.error('Error fetching watched movies:', error);
		res.status(500).json({ message: 'Failed to fetch watched movies.' });
	}
});

export default router;
