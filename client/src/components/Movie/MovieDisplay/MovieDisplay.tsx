import * as React from 'react';
import axios from 'axios';
import PlaceholderPoster from '../../../../../assets/img/placeholder.jpg';
import languageMap from '../../../../constants/languageMap';
import { useNavigate } from 'react-router-dom';
import './MovieDisplay.css';

// Props interface defining the structure of the movie object
interface MovieDisplayProps {
	movie: {
		title: string;
		genres: string[];
		releaseYear?: string;
		synopsis?: string;
		poster?: string;
		runtime?: number;
		cast?: string[];
		directors?: string[];
		producers?: string[];
		language: string;
		imdbId: string;
		streaming?: {
			link: string;
			service: {
				imageSet?: {
					lightThemeImage?: string;
					darkThemeImage?: string;
				};
			};
		}[];
	};
}

const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie }) => {
	const languageFullName = languageMap[movie.language] || movie.language;
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

	// Check login status dynamically
	React.useEffect(() => {
		const token = localStorage.getItem('token');
		setIsLoggedIn(!!token);

		const handleStorageChange = () => {
			const token = localStorage.getItem('token');
			setIsLoggedIn(!!token);
		};

		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	const getStreamingImage = (imageSet?: {
		lightThemeImage?: string;
		darkThemeImage?: string;
	}) => {
		const prefersDarkScheme = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		if (!imageSet) return PlaceholderPoster;
		return prefersDarkScheme
			? imageSet.darkThemeImage || PlaceholderPoster
			: imageSet.lightThemeImage || PlaceholderPoster;
	};

	const handleSaveMovie = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/auth/login');
			return;
		}

		try {
			const backendUrl =
				import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

			const movieData = {
				movieId: movie.imdbId,
				title: movie.title,
				poster: movie.poster || '',
				genres: movie.genres,
				releaseYear: movie.releaseYear || null,
				synopsis: movie.synopsis || null,
				runtime: movie.runtime || null,
				cast: movie.cast || [],
				directors: movie.directors || [],
				producers: movie.producers || [],
				streaming: movie.streaming || [],
			};

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
		<div className='movie-container'>
			<img
				className='movie-poster'
				src={movie.poster || PlaceholderPoster}
				alt={`Movie poster for ${movie.title}`}
			/>
			<div className='movie-details'>
				<div className='button-container'>
					{isLoggedIn ? (
						<button
							className='button save-movie-button'
							onClick={handleSaveMovie}>
							Save Movie
						</button>
					) : (
						<button
							className='button login-register-button'
							onClick={() => navigate('/auth/login')}>
							Login to Save Movie
						</button>
					)}
				</div>
				<h2 className='movie-title'>{movie.title}</h2>
				<div className='movie-meta'>
					<p>
						<strong>Genres:</strong> {movie.genres.join(', ')}
					</p>
					<p>
						<strong>Release Year:</strong>{' '}
						{movie.releaseYear || 'N/A'}
					</p>
					<p>
						<strong>Language:</strong> {languageFullName}
					</p>
					<p>
						<strong>Runtime:</strong>{' '}
						{movie.runtime
							? `${Math.floor(movie.runtime / 60)}h ${
									movie.runtime % 60
							  }m`
							: 'N/A'}
					</p>
				</div>
				<div className='movie-streaming'>
					<strong>Streaming Options:</strong>
					<ul>
						{movie.streaming?.map((option, index) => (
							<li key={index}>
								<a
									href={option.link}
									target='_blank'
									rel='noopener noreferrer'>
									<img
										src={getStreamingImage(
											option.service.imageSet
										)}
										alt={`Streaming option ${index + 1}`}
									/>
								</a>
							</li>
						)) || <p>No streaming options available.</p>}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MovieDisplay;
