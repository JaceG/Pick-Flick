import { Request, Response } from 'express';
import {
	validateSaveMovieInput,
	validateQueryParams,
} from '../utils/validation.js';
import {
	checkIfMovieExists,
	createNewMovie,
} from '../services/movieService.js';
import {
	fetchMovieDetails,
	fetchStreamingOptions,
} from '../utils/apiHelpers.js';
import { genreMap, nameToIdMap } from '../utils/genreMaps.js';
import { fetchMovies } from '../models/fetchMovies.js';

export const saveMovie = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;

		// Validate userId and convert to string if needed
		if (!userId) {
			return res.status(400).json({ message: 'User ID is required.' });
		}

		const { valid, message } = validateSaveMovieInput({
			...req.body,
			userId,
		});

		if (!valid) {
			return res.status(400).json({ message });
		}

		const { movieId } = req.body;

		// Check if the movie already exists
		const existingMovie = await checkIfMovieExists(
			userId.toString(),
			movieId
		);
		if (existingMovie) {
			return res.status(400).json({ message: 'Movie is already saved.' });
		}

		// Save the new movie
		const newMovie = await createNewMovie({
			...req.body,
			userId: userId.toString(),
		});
		res.status(201).json({
			message: 'Movie saved successfully.',
			movie: newMovie,
		});
	} catch (error) {
		console.error('Error in saveMovie:', error);
		res.status(500).json({ message: 'An unexpected error occurred.' });
	}
};

export const getRandomMovie = async (req: Request, res: Response) => {
	try {
		const {
			genre,
			startYear,
			endYear,
			minRuntime,
			maxRuntime,
			language,
			region,
		} = req.query;

		// Validate query parameters
		validateQueryParams({ startYear, endYear, minRuntime, maxRuntime });

		const params: { [key: string]: any } = {
			api_key: process.env.TMDB_API_KEY,
			sort_by: 'popularity.desc',
			page: Math.floor(Math.random() * 500) + 1,
		};

		// Process genres
		if (genre) {
			const genreIds = genre
				.toString()
				.split(',')
				.map((g) => g.trim())
				.map((g) => nameToIdMap[g.toLowerCase()] || g)
				.filter((g) => !isNaN(Number(g)));
			if (genreIds.length > 0) {
				params.with_genres = genreIds.join(',');
			} else {
				return res
					.status(400)
					.json({ error: `Invalid genres provided: ${genre}` });
			}
		}

		// Add year range filters
		if (startYear)
			params['primary_release_date.gte'] = `${startYear}-01-01`;
		if (endYear) params['primary_release_date.lte'] = `${endYear}-12-31`;

		// Add runtime filters
		if (minRuntime) params['with_runtime.gte'] = Number(minRuntime);
		if (maxRuntime) params['with_runtime.lte'] = Number(maxRuntime);

		// Add language filter
		if (language && language !== 'any') {
			params.with_original_language = language;
		}

		// Fetch movies
		const movies = await fetchMovies(params);
		if (movies.length === 0) {
			throw new Error('No movies found for the given filters.');
		}

		const randomMovie = movies[Math.floor(Math.random() * movies.length)];
		const movieDetails = await fetchMovieDetails(
			randomMovie.id,
			language as string
		);
		const streamingOptions = await fetchStreamingOptions(
			movieDetails.imdb_id,
			(region as string) || 'us'
		);

		// Respond with movie data
		res.json({
			title: randomMovie.title,
			genres: randomMovie.genre_ids.map(
				(id: number) => genreMap[id] || 'Unknown'
			),
			releaseYear: randomMovie.release_date.split('-')[0],
			synopsis: randomMovie.overview,
			poster: randomMovie.poster_path
				? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`
				: null,
			runtime: movieDetails.runtime || 0,
			cast: movieDetails.credits.cast
				.slice(0, 5)
				.map((actor: any) => actor.name),
			directors: movieDetails.credits.crew
				.filter((crew: any) => crew.job === 'Director')
				.map((director: any) => director.name),
			producers: movieDetails.credits.crew
				.filter((crew: any) => crew.job === 'Producer')
				.map((producer: any) => producer.name),
			language: randomMovie.original_language,
			imdbId: movieDetails.imdb_id,
			streaming: streamingOptions,
		});
	} catch (error) {
		console.error('Error in getRandomMovie:', error);

		if (error instanceof Error) {
			return res
				.status(500)
				.json({
					message: 'Failed to fetch a random movie.',
					error: error.message,
				});
		}

		return res
			.status(500)
			.json({
				message: 'Failed to fetch a random movie.',
				error: 'Unknown error occurred.',
			});
	}
};
