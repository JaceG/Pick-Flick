import axios from 'axios';

export const fetchMovies = async (
	params: any,
	maxRetries = 3
): Promise<any[]> => {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			// Log the parameters being sent to the API
			console.log(
				`TMDB API request parameters (attempt ${attempt + 1}):`,
				params
			);

			// Make the API request
			const response = await axios.get(
				'https://api.themoviedb.org/3/discover/movie',
				{ params }
			);

			// Log the response data
			console.log('TMDB API response:', response?.data);

			// Check if the response contains movie results
			if (response.data.results && response.data.results.length > 0) {
				return response.data.results;
			}

			// Handle pagination and retry if no results are found
			if (response.data.total_pages > 1) {
				params.page =
					Math.floor(Math.random() * response.data.total_pages) + 1;
				console.warn(
					`No results found on this page. Retrying with page ${params.page}.`
				);
			} else {
				console.warn(
					'No results found, and no additional pages to fetch.'
				);
				break; // Exit loop if no additional pages are available
			}
		} catch (error) {
			// Handle Axios-specific errors
			if (axios.isAxiosError(error)) {
				console.error(
					'Axios error during TMDB fetch:',
					error.response?.data || error.message
				);

				// Handle rate-limiting errors
				if (error.response?.status === 429) {
					console.error(
						'Rate limit exceeded. Waiting before retrying...'
					);
					await new Promise(
						(resolve) => setTimeout(resolve, 1000) // Wait 1 second before retrying
					);
				}
			} else {
				// Log unexpected errors
				console.error('Unexpected error during movie fetch:', error);
			}
		}
	}

	// Return an empty array if all retries fail
	console.warn(
		'Failed to fetch movies after maximum retries. Returning an empty array.'
	);
	return [];
};
