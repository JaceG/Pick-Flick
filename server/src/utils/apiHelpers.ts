import axios from 'axios';

export const fetchMovieDetails = async (movieId: string, language: string) => {
	const { data } = await axios.get(
		`https://api.themoviedb.org/3/movie/${movieId}`,
		{
			params: {
				api_key: process.env.TMDB_API_KEY,
				language: language || 'en-US',
				append_to_response: 'credits',
			},
		}
	);
	return data;
};

export const fetchStreamingOptions = async (imdbId: string, region: string) => {
	const { data } = await axios.get(
		`https://streaming-availability.p.rapidapi.com/shows/${imdbId}`,
		{
			headers: { 'x-rapidapi-key': process.env.MOTN_API_KEY },
			params: { region },
		}
	);

	// Deduplicate streaming options
	if (data.streamingOptions?.[region]) {
		const uniqueStreaming = Object.values(
			data.streamingOptions[region].reduce((acc: any, curr: any) => {
				if (!acc[curr.service.id]) {
					acc[curr.service.id] = curr;
				}
				return acc;
			}, {})
		);
		return uniqueStreaming;
	}

	return [];
};
