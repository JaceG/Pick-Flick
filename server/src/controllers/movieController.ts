import axios from 'axios';
import { TMDB_API_KEY, MOTN_API_KEY } from '../config/config.js';
import { Request, Response } from 'express';

export const getRandomMovieByStreaming = async (
	req: Request,
	res: Response
) => {
	try {
		res.header('Content-Type', 'application/json');
		const streamingServices = (req.query.streamingService as string).split(
			','
		);
		const genre = req.query.genre as string | undefined;
		const startYear = req.query.startYear as string | undefined;
		const endYear = req.query.endYear as string | undefined;
		const language = req.query.language as string | undefined;

		console.log('Streaming search params:', {
			streamingServices,
			genre,
			startYear,
			endYear,
			language,
		});

		console.log('API request params:', {
			streamingServices,
			genre,
			startYear,
			endYear,
			language,
		});

		if (!streamingServices || streamingServices.length === 0) {
			return res
				.status(400)
				.json({ error: 'Streaming service is required' });
		}

		// Map streaming service names to MOTN API expected format
		const serviceMapping = {
			netflix: 'netflix',
			prime: 'prime',
			disney: 'disney',
			hbo: 'hbo',
			hulu: 'hulu',
			peacock: 'peacock',
			paramount: 'paramount',
			apple: 'apple',
			mubi: 'mubi',
			showtime: 'showtime',
			starz: 'starz',
		};

		const mappedServices = streamingServices
			.map((service) => serviceMapping[service.toLowerCase()])
			.filter(Boolean);

		if (mappedServices.length === 0) {
			return res.status(400).json({ error: 'Invalid streaming service' });
		}

		const motnResponse = await axios({
			method: 'GET',
			url: 'https://streaming-availability.p.rapidapi.com/v2/search/basic',
			params: {
				country: 'us',
				services: mappedServices.join(','),
				output_language: 'en',
				show_type: 'movie',
				genre: genre || undefined,
				year_min: startYear || '1900',
				year_max: endYear || '2024',
				language: language === 'any' ? undefined : language,
			},
			headers: {
				'X-RapidAPI-Key': MOTN_API_KEY,
				'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
			},
		});

		console.log(
			'API Response:',
			JSON.stringify(motnResponse.data, null, 2)
		);
		console.log(
			'MOTN API Response:',
			JSON.stringify(motnResponse.data, null, 2)
		);

		if (
			!motnResponse.data.result ||
			motnResponse.data.result.length === 0
		) {
			return res.status(404).json({
				message: 'No movies found matching the criteria',
				params: {
					streamingServices,
					genre,
					startYear,
					endYear,
					language,
				},
			});
		}

		const movies = motnResponse.data.result;
		const randomMovie = movies[Math.floor(Math.random() * movies.length)];

		const tmdbResponse = await axios.get(
			`https://api.themoviedb.org/3/movie/${randomMovie.tmdbId}`,
			{
				params: {
					api_key: TMDB_API_KEY,
					append_to_response: 'credits,similar',
				},
			}
		);

		console.log(
			'API Response:',
			JSON.stringify(tmdbResponse.data, null, 2)
		);

		const streamingInfo = randomMovie.streamingInfo?.us
			? Object.entries(randomMovie.streamingInfo.us).map(
					([service, details]) => ({
						service: {
							name: service,
							imageSet: {
								lightThemeImage: `https://www.movieofthenight.com/static/services/${service}/logo-light.svg`,
								darkThemeImage: `https://www.movieofthenight.com/static/services/${service}/logo-dark.svg`,
							},
						},
						link:
							Array.isArray(details) && details.length > 0
								? details[0].link
								: '',
					})
			  )
			: [];

		const movieDetails = {
			title: randomMovie.title,
			overview: randomMovie.overview,
			releaseYear: randomMovie.year.toString(),
			streamingInfo: streamingInfo,
			poster: `https://image.tmdb.org/t/p/w500${tmdbResponse.data.poster_path}`,
			tmdbRating: tmdbResponse.data.vote_average,
			runtime: tmdbResponse.data.runtime,
			genres: tmdbResponse.data.genres.map((genre) => genre.name),
			cast: tmdbResponse.data.credits.cast
				.slice(0, 5)
				.map((actor) => actor.name),
			directors: tmdbResponse.data.credits.crew
				.filter((crewMember) => crewMember.job === 'Director')
				.map((director) => director.name),
			synopsis: randomMovie.overview,
			language: tmdbResponse.data.original_language,
			imdbId: randomMovie.imdbId,
			streaming: streamingInfo,
		};

		res.json(movieDetails);
	} catch (error) {
		console.error('Error fetching streaming movie:', error);
		if (axios.isAxiosError(error)) {
			console.error('API Error Response:', error.response?.data);
			return res.status(500).json({
				error: 'Failed to fetch movie',
				details: error.response?.data,
			});
		}
		res.status(500).json({ error: 'An unexpected error occurred' });
	}
};

export const getRandomMovie = async (req: Request, res: Response) => {
	try {
		res.header('Content-Type', 'application/json');
		const genre = req.query.genre as string | undefined;
		const startYear = req.query.startYear as string | undefined;
		const endYear = req.query.endYear as string | undefined;
		const minRuntime = req.query.minRuntime as string | undefined;
		const maxRuntime = req.query.maxRuntime as string | undefined;
		const language = req.query.language as string | undefined;

		console.log('Random movie search params:', {
			genre,
			startYear,
			endYear,
			minRuntime,
			maxRuntime,
			language,
		});

		console.log('API request params:', {
			genre,
			startYear,
			endYear,
			minRuntime,
			maxRuntime,
			language,
		});

		const tmdbResponse = await axios.get(
			'https://api.themoviedb.org/3/discover/movie',
			{
				params: {
					api_key: TMDB_API_KEY,
					with_genres: genre,
					'primary_release_date.gte': startYear
						? `${startYear}-01-01`
						: undefined,
					'primary_release_date.lte': endYear
						? `${endYear}-12-31`
						: undefined,
					'with_runtime.gte': minRuntime,
					'with_runtime.lte': maxRuntime,
					with_original_language:
						language === 'any' ? undefined : language,
					page: Math.floor(Math.random() * 5) + 1,
				},
			}
		);

		console.log(
			'API Response:',
			JSON.stringify(tmdbResponse.data, null, 2)
		);

		if (
			!tmdbResponse.data.results ||
			tmdbResponse.data.results.length === 0
		) {
			return res.status(404).json({
				message: 'No movies found matching the criteria',
				params: {
					genre,
					startYear,
					endYear,
					minRuntime,
					maxRuntime,
					language,
				},
			});
		}

		const movies = tmdbResponse.data.results;
		const randomMovie = movies[Math.floor(Math.random() * movies.length)];

		const movieDetailsResponse = await axios.get(
			`https://api.themoviedb.org/3/movie/${randomMovie.id}`,
			{
				params: {
					api_key: TMDB_API_KEY,
					append_to_response: 'credits',
				},
			}
		);

		console.log(
			'API Response:',
			JSON.stringify(movieDetailsResponse.data, null, 2)
		);

		const movieDetails = {
			title: movieDetailsResponse.data.title,
			overview: movieDetailsResponse.data.overview,
			releaseYear: new Date(movieDetailsResponse.data.release_date)
				.getFullYear()
				.toString(),
			poster: `https://image.tmdb.org/t/p/w500${movieDetailsResponse.data.poster_path}`,
			runtime: movieDetailsResponse.data.runtime,
			genres: movieDetailsResponse.data.genres.map((genre) => genre.name),
			cast: movieDetailsResponse.data.credits.cast
				.slice(0, 5)
				.map((actor) => actor.name),
			directors: movieDetailsResponse.data.credits.crew
				.filter((crewMember) => crewMember.job === 'Director')
				.map((director) => director.name),
			synopsis: movieDetailsResponse.data.overview,
			language: movieDetailsResponse.data.original_language,
			imdbId: movieDetailsResponse.data.imdb_id,
			streaming: [], // Empty array for consistency with streaming-specific searches
		};

		res.json(movieDetails);
	} catch (error) {
		console.error('Error fetching random movie:', error);
		if (axios.isAxiosError(error)) {
			console.error('API Error Response:', error.response?.data);
			return res.status(500).json({
				error: 'Failed to fetch movie',
				details: error.response?.data,
			});
		}
		res.status(500).json({ error: 'An unexpected error occurred' });
	}
};
