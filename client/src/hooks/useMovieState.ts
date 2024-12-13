import { useState } from 'react';
import { getBaseUrl } from '../utils/getBaseUrl';
import axios from 'axios';

export const useMovieState = () => {
	const [movie, setMovie] = useState<{
		title: string;
		genres: string[];
		releaseYear: string;
		synopsis: string;
		poster: string;
		runtime: number;
		cast: string[];
		directors: string[];
		producers: string[];
		language: string;
		imdbId: string;
		streaming: { [key: string]: any }[];
	} | null>(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loggedIn, setLoggedIn] = useState(false);

	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [yearRange, setYearRange] = useState<[number, number]>([1988, 2024]);
	const [runtimeRange, setRuntimeRange] = useState<[number, number]>([
		0, 360,
	]);
	const [selectedLanguage, setSelectedLanguage] = useState<string>('any');

	const handleRangeChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		range: [number, number],
		setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
		index: number
	) => {
		const newRange = [...range];
		newRange[index] = parseInt(e.target.value, 10);
		if (newRange[0] <= newRange[1]) {
			setRange([newRange[0], newRange[1]]);
		}
	};

	const handleFetchMovie = async () => {
		setLoading(true);
		setError(null);
		try {
			const baseUrl = await getBaseUrl();
			console.log('Base URL:', baseUrl); // Debugging

			const response = await axios.get(`${baseUrl}/api/movies/random`, {
				params: {
					genre: selectedGenres.join(','),
					startYear: yearRange[0],
					endYear: yearRange[1],
					minRuntime: runtimeRange[0],
					maxRuntime: runtimeRange[1],
					language:
						selectedLanguage === 'any'
							? undefined
							: selectedLanguage,
				},
			});
			const fetchedMovie = response.data;
			setMovie({
				...fetchedMovie,
				imdbId: fetchedMovie.imdbId || 'N/A',
				streaming: fetchedMovie.streaming || [],
			});
		} catch (err) {
			console.error('Error fetching movie:', err);
			if (axios.isAxiosError(err)) {
				console.error('Response data:', err.response?.data);
			}
			setError('Failed to fetch a random movie. Please try again.');
			setMovie(null); // Reset movie on error
		} finally {
			setLoading(false);
		}
	};

	return {
		movie,
		loading,
		error,
		loggedIn,
		selectedGenres,
		yearRange,
		runtimeRange,
		selectedLanguage,
		setLoggedIn,
		setSelectedGenres,
		setYearRange,
		setRuntimeRange,
		setSelectedLanguage,
		handleRangeChange,
		handleFetchMovie,
	};
};
