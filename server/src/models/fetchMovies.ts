import axios from 'axios';

export const fetchMovies = async (
	params: any,
	maxRetries = 3
): Promise<any[]> => {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			console.log(
				`TMDB API request parameters (attempt ${attempt + 1}):`,
				params
			);
			const response = await axios.get(
				'https://api.themoviedb.org/3/discover/movie',
				{ params }
			);
			console.log('TMDB API response:', response?.data?.results);
			if (response.data.results.length > 0) {
				return response.data.results;
			}
			params.page =
				Math.floor(Math.random() * response.data.total_pages) + 1;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					'Error fetching movies from TMDB:',
					error.message
				);
			} else {
				console.error('Unexpected error during movie fetch:', error);
			}
		}
	}
	return [];
};
