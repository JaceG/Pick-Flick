import * as React from 'react';
import axios from 'axios';
import PlaceholderPoster from '../../../../assets/img/placeholder.jpg';
import languageMap from '../../../constants/languageMap';
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

		// Update state when localStorage changes (e.g., during logout/login actions)
		const handleStorageChange = () => {
			const token = localStorage.getItem('token');
			setIsLoggedIn(!!token);
		};

		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	// Function to get the appropriate image based on the theme
	const getStreamingImage = (imageSet?: {
		lightThemeImage?: string;
		darkThemeImage?: string;
	}) => {
		const prefersDarkScheme = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		if (!imageSet) return '/path/to/placeholder.jpg'; // Fallback image
		return prefersDarkScheme
			? imageSet.darkThemeImage || '/path/to/placeholder.jpg'
			: imageSet.lightThemeImage || '/path/to/placeholder.jpg';
	};

	// Function to save the movie
	const handleSaveMovie = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/auth/login'); // Redirect to login page if not logged in
			return;
		}

		try {
			// Include all relevant fields when saving the movie
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

			console.log('Sending movie data:', movieData);

			const backendUrl =
				import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

			console.log('Backend URL:', backendUrl);

			const response = await axios.post(
				`${backendUrl}/api/movies/save`,
				movieData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log('Movie saved successfully:', response.data);
			navigate('/saved-movies'); // Redirect to Saved Movies
		} catch (error) {
			console.error('Failed to save movie:', error);

			if (axios.isAxiosError(error)) {
				if (error.response) {
					alert(
						`Error: ${
							error.response.data.message ||
							'Unknown error occurred.'
						}`
					);
				} else {
					alert('Unable to connect to the server. Please try again.');
				}
			} else {
				alert('An unexpected error occurred.');
			}
		}
	};

	// Function to handle login/register redirection
	const handleLoginRegister = () => {
		navigate('/auth/login'); // Redirect to login page instead of register
	};

	return (
		<div className='movie-container'>
			<img
				className='movie-poster'
				src={movie.poster || PlaceholderPoster}
				alt={
					movie.poster
						? `Movie poster for ${movie.title}`
						: `Placeholder for ${movie.title}`
				}
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
							onClick={handleLoginRegister}>
							Login/Register to Save Movie
						</button>
					)}
				</div>
				<h2 className='movie-title'>{movie.title}</h2>
				<div className='movie-meta'>
					<div className='movie-genres'>
						<p>
							<strong>{movie.genres.join(', ')}</strong>
						</p>
					</div>
					<div className='movie-release'>
						<p>
							<strong>Release Year:</strong>{' '}
							{movie.releaseYear || 'Not Available'}
						</p>
					</div>
				</div>
				<div className='movie-language'>
					<p>
						<strong>Language:</strong> {languageFullName}
					</p>
				</div>
				<div className='movie-runtime'>
					<p>
						<strong>Runtime:</strong>{' '}
						{movie.runtime
							? `${Math.floor(movie.runtime / 60)}h ${
									movie.runtime % 60
							  }m`
							: 'Not Available'}
					</p>
				</div>
				<div className='movie-synopsis'>
					<p>
						<strong>Synopsis:</strong>{' '}
						{movie.synopsis || 'Not Available'}
					</p>
				</div>
				<div className='movie-credits'>
					<div>
						<p>
							<strong>Cast:</strong>{' '}
							{movie.cast?.join(', ') || 'Not Available'}
						</p>
					</div>
					<div>
						<p>
							<strong>Director(s):</strong>{' '}
							{movie.directors?.join(', ') || 'Not Available'}
						</p>
					</div>
					<div>
						<p>
							<strong>Producer(s):</strong>{' '}
							{movie.producers?.join(', ') || 'Not Available'}
						</p>
					</div>
				</div>
				<div className='movie-streaming'>
					<p>
						<strong>Streaming Options:</strong>
					</p>
					{movie.streaming && movie.streaming.length > 0 ? (
						<ul>
							{movie.streaming.map((option, index) => (
								<li key={index}>
									<a
										href={option.link}
										target='_blank'
										rel='noopener noreferrer'>
										<img
											src={getStreamingImage(
												option.service?.imageSet
											)}
											className='streaming-image'
											alt={`Streaming option ${
												index + 1
											}`}
											width={100}
										/>
									</a>
								</li>
							))}
						</ul>
					) : (
						<p>No streaming options available.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default MovieDisplay;
