import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SaveMovieButtonProps {
	movieData: {
		movieId: string;
		title: string;
		poster?: string;
		genres: string[];
		releaseYear?: string;
		synopsis?: string;
		runtime?: number;
		cast?: string[];
		directors?: string[];
		producers?: string[];
		streaming?: {
			link: string;
			service: {
				imageSet: {
					lightThemeImage?: string;
					darkThemeImage?: string;
				};
			};
		}[];
	};
	isLoggedIn: boolean;
}

const SaveMovieButton: React.FC<SaveMovieButtonProps> = ({
	movieData,
	isLoggedIn,
}) => {
	const navigate = useNavigate();

	// Function to handle saving the movie
	const handleSaveMovie = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			alert('Please log in to save movies.');
			navigate('/auth/login');
			return;
		}

		try {
			// Backend URL
			const backendUrl =
				import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

			// Log the movieData for debugging
			console.log('Sending movie data:', movieData);

			// API call to save the movie
			const response = await axios.post(
				`${backendUrl}/api/movies/save`,
				movieData,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			console.log('Movie saved successfully:', response.data);
			navigate('/saved-movies');
		} catch (error) {
			console.error('Failed to save movie:', error);

			// Show specific error message if available, otherwise a generic one
			alert(
				axios.isAxiosError(error) && error.response?.data?.message
					? `Error: ${error.response.data.message}`
					: 'An unexpected error occurred. Please try again.'
			);
		}
	};

	return (
		<button
			className='button save-movie-button'
			onClick={handleSaveMovie}
			disabled={!isLoggedIn}>
			{isLoggedIn ? 'Save Movie' : 'Login to Save Movie'}
		</button>
	);
};

export default SaveMovieButton;
