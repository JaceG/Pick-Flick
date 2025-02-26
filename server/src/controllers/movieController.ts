import { Request, Response } from 'express';
import axios from 'axios';
import { fetchMovies } from '../models/fetchMovies.js';
import { genreMap } from '../utils/genreMaps.js';
import { TMDB_API_KEY, MOTN_API_KEY } from '../config/config.js';
import SavedMovie from '../models/SavedMovies.js'; // Import SavedMovie model

if (!TMDB_API_KEY) {
	throw new Error('TMDB_API_KEY is not defined in the environment variables');
}

// Function to save a movie to the database
// Updated saveMovie function
export const saveMovie = async (req: Request, res: Response) => {
	try {
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

		const userId = req.user?.id; // Ensure the user ID is extracted properly

		// Validate required fields
		if (!userId || !movieId || !title) {
			return res.status(400).json({
				message: 'Missing required fields: userId, movieId, or title.',
			});
		}

		// Check if the movie is already saved
		const existingMovie = await SavedMovie.findOne({
			where: { userId, movieId },
		});
		if (existingMovie) {
			return res.status(400).json({ message: 'Movie is already saved.' });
		}

		// Save the movie with all fields, including streaming options
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
			streaming, // Save streaming options
		});

		res.status(201).json({
			message: 'Movie saved successfully.',
			movie: newMovie,
		});
	} catch (error) {
		console.error('Error in saveMovie route:', error);
		res.status(500).json({ message: 'An unexpected error occurred.' });
	}
};

// Existing function for fetching random movies
export const getRandomMovie = async (req: Request, res: Response) => {
	const {
		genre,
		startYear,
		endYear,
		minRuntime,
		maxRuntime,
		language,
		region,
	} = req.query;

	try {
		const params: { [key: string]: any } = {
			api_key: TMDB_API_KEY,
			sort_by: 'popularity.desc',
			page: Math.floor(Math.random() * 500) + 1,
			include_adult: false,
			language: 'en-US',
		};

		// Add filters if they exist
		if (genre) params.with_genres = genre;
		if (startYear)
			params['primary_release_date.gte'] = `${startYear}-01-01`;
		if (endYear) params['primary_release_date.lte'] = `${endYear}-12-31`;
		if (minRuntime) params['with_runtime.gte'] = minRuntime;
		if (maxRuntime) params['with_runtime.lte'] = maxRuntime;
		if (language) params.language = language;
		if (region) params.region = region;

		const movies = await fetchMovies(params);

		if (!movies || movies.length === 0) {
			return res.status(404).json({
				error: 'No movies found matching your criteria. Try adjusting your filters.',
			});
		}

		// Transform the TMDB movie format to match your frontend format
		const movie = movies[0];
		const transformedMovie = {
			title: movie.title,
			genres:
				movie.genre_ids?.map((id) => genreMap[id] || 'Unknown') || [],
			releaseYear: movie.release_date?.split('-')[0],
			synopsis: movie.overview,
			poster: movie.poster_path
				? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
				: null,
			runtime: null,
			language: movie.original_language,
			imdbId: movie.id.toString(),
			streaming: [],
		};

		// Fetch streaming options from MOTN API
		try {
			const motnResponse = await axios.get(
				`https://api.movieofthenight.com/v2/movie/${movie.id}/streaming`,
				{
					headers: {
						Authorization: `Bearer ${MOTN_API_KEY}`,
					},
				}
			);

			if (motnResponse.data && motnResponse.data.streaming) {
				transformedMovie.streaming = motnResponse.data.streaming;
			}
		} catch (streamingError) {
			console.warn('Failed to fetch streaming options:', streamingError);
			// Don't fail the whole request if streaming data fails
		}

		return res.json(transformedMovie);
	} catch (error) {
		console.error('Error in getRandomMovie:', error);
		return res.status(500).json({
			error: 'Failed to fetch a random movie after multiple attempts.',
			details:
				error instanceof Error
					? error.message
					: 'Failed to fetch movies.',
		});
	}
};
