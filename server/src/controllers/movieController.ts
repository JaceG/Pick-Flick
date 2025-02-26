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
	try {
		console.log('Starting random movie fetch...');
		console.log('Query params:', req.query);

		const maxRetries = 3;
		let attempts = 0;

		const fetchRandomMovie = async () => {
			try {
				// Check if TMDB API key is available
				if (!process.env.TMDB_API_KEY) {
					throw new Error('TMDB API key is not configured');
				}

				// Log the API key existence (not the key itself)
				console.log(
					'TMDB API Key available:',
					!!process.env.TMDB_API_KEY
				);

				const {
					genre,
					startYear,
					endYear,
					minRuntime,
					maxRuntime,
					language,
					region,
				} = req.query;

				const params: { [key: string]: any } = {
					api_key: TMDB_API_KEY,
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
							.json({
								error: `Invalid genres provided: ${genre}`,
							});
					}
				}

				// Add year range filters
				if (startYear && isNaN(Number(startYear))) {
					return res
						.status(400)
						.json({ error: 'Start year must be a valid number.' });
				}
				if (endYear && isNaN(Number(endYear))) {
					return res
						.status(400)
						.json({ error: 'End year must be a valid number.' });
				}
				if (
					startYear &&
					endYear &&
					Number(startYear) > Number(endYear)
				) {
					return res
						.status(400)
						.json({
							error: 'Start year cannot be greater than end year.',
						});
				}
				if (startYear)
					params['primary_release_date.gte'] = `${startYear}-01-01`;
				if (endYear)
					params['primary_release_date.lte'] = `${endYear}-12-31`;

				// Add runtime filters
				if (minRuntime && isNaN(Number(minRuntime))) {
					return res
						.status(400)
						.json({
							error: 'Minimum runtime must be a valid number.',
						});
				}
				if (maxRuntime && isNaN(Number(maxRuntime))) {
					return res
						.status(400)
						.json({
							error: 'Maximum runtime must be a valid number.',
						});
				}
				if (minRuntime) params['with_runtime.gte'] = Number(minRuntime);
				if (maxRuntime) params['with_runtime.lte'] = Number(maxRuntime);

				// Add language filter
				if (language && language !== 'any') {
					params.with_original_language = language;
				}

				const movies = await fetchMovies(params);
				if (movies.length > 0) {
					const randomMovie =
						movies[Math.floor(Math.random() * movies.length)];
					// Fetch additional movie details
					const movieDetails = await axios.get(
						`https://api.themoviedb.org/3/movie/${
							randomMovie.id
						}?api_key=${TMDB_API_KEY}&language=${
							language || 'en-US'
						}&append_to_response=credits`
					);

					// Use the region parameter or default to 'us'
					const selectedRegion = (region as string) || 'us';
					const streamingDetails = await axios.get(
						`https://streaming-availability.p.rapidapi.com/shows/${randomMovie.id}`,
						{
							headers: {
								'x-rapidapi-key': MOTN_API_KEY,
							},
							params: {
								region: selectedRegion,
							},
						}
					);

					let options: unknown[] = [];
					if (streamingDetails.data.streamingOptions) {
						options =
							streamingDetails.data.streamingOptions[
								selectedRegion
							];
						options = options.reduce(
							(prev: unknown[], curr: any) => {
								if (
									prev.find(
										(opt: any) =>
											opt.service.id === curr.service.id
									)
								) {
									return prev;
								}
								return [...prev, curr];
							},
							[]
						);
					}

					const genreNames = randomMovie.genre_ids.map(
						(id: number) => genreMap[id] || 'Unknown'
					);
					const cast = movieDetails.data.credits.cast
						.slice(0, 5)
						.map((actor: any) => actor.name); // Top 5 actors
					const directors = movieDetails.data.credits.crew
						.filter(
							(crewMember: any) => crewMember.job === 'Director'
						)
						.map((director: any) => director.name);
					const producers = movieDetails.data.credits.crew
						.filter(
							(crewMember: any) => crewMember.job === 'Producer'
						)
						.map((producer: any) => producer.name);
					res.json({
						title: randomMovie.title,
						genres: genreNames,
						releaseYear: randomMovie.release_date.split('-')[0],
						synopsis: randomMovie.overview,
						poster: randomMovie.poster_path
							? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`
							: null,
						runtime: movieDetails.data.runtime || 0, // Include runtime
						cast,
						directors,
						producers,
						language: randomMovie.original_language,
						imdbId: movieDetails.data.imdb_id, // Include IMDb ID
						streaming: options,
					});
				} else {
					throw new Error('No movies found for the given filters.');
				}
			} catch (error) {
				console.error('Error in fetchRandomMovie:', error);
				if (error instanceof Error) {
					throw new Error(`Movie fetch failed: ${error.message}`);
				} else {
					throw new Error('Movie fetch failed with unknown error');
				}
			}
		};

		while (attempts < maxRetries) {
			try {
				await fetchRandomMovie();
				return;
			} catch (error) {
				attempts++;
				console.warn(`Attempt ${attempts} failed:`, error);

				if (attempts >= maxRetries) {
					console.error('All retry attempts failed');
					return res.status(500).json({
						error: 'Failed to fetch a random movie after multiple attempts.',
						details:
							error instanceof Error
								? error.message
								: 'Unknown error',
					});
				}
			}
		}
	} catch (error) {
		console.error('Unhandled error in getRandomMovie:', error);
		res.status(500).json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};
