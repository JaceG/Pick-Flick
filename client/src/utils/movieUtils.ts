// Import the `Movie` interface from the correct shared type definition
import { Movie } from '../types/movieTypes'; // Adjust the path to match your project structure

// Sort movies based on the selected option
export const sortMovies = (movies: Movie[], sortOption: string): Movie[] => {
	switch (sortOption) {
		case 'title':
			// Sort alphabetically by title
			return [...movies].sort((a, b) => a.title.localeCompare(b.title));
		case 'year':
			// Sort by release year (descending)
			return [...movies].sort(
				(a, b) =>
					(parseInt(b.releaseYear || '0') || 0) -
					(parseInt(a.releaseYear || '0') || 0)
			);
		case 'runtime':
			// Sort by runtime (descending)
			return [...movies].sort(
				(a, b) => (b.runtime || 0) - (a.runtime || 0)
			);
		default:
			return movies; // Return unsorted if no valid sort option is provided
	}
};

// Filter movies based on the selected genre
export const filterMovies = (
	movies: Movie[],
	filterOption: string
): Movie[] => {
	if (filterOption === 'all') return movies; // If "all" is selected, return all movies
	return movies.filter((movie) => movie.genres.includes(filterOption));
};
