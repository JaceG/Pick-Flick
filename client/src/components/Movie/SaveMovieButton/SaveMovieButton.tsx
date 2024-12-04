import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SaveMovieButtonProps {
	movieData: any; // Replace `any` with your movie data type if available
	isLoggedIn: boolean;
}

const SaveMovieButton: React.FC<SaveMovieButtonProps> = ({
	movieData,
	isLoggedIn,
}) => {
	const navigate = useNavigate();

	const handleSaveMovie = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/auth/login');
			return;
		}

		try {
			const backendUrl =
				import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

			await axios.post(`${backendUrl}/api/movies/save`, movieData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			navigate('/saved-movies');
		} catch (error) {
			console.error('Failed to save movie:', error);
			alert(
				axios.isAxiosError(error) && error.response?.data.message
					? error.response.data.message
					: 'An unexpected error occurred.'
			);
		}
	};

	return (
		<button className='button save-movie-button' onClick={handleSaveMovie}>
			{isLoggedIn ? 'Save Movie' : 'Login to Save Movie'}
		</button>
	);
};

export default SaveMovieButton;
