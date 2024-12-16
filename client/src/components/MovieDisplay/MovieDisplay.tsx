import * as React from 'react';
import axios from 'axios';
import PlaceholderPoster from '../../../../assets/img/placeholder.jpg';
import languageMap from '../../../constants/languageMap';
import { useNavigate } from 'react-router-dom';
import './MovieDisplay.css';

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
	const languageFullName = movie.language
		? languageMap[movie.language] || movie.language
		: 'Not specified';
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
	const [selectedStreamingServices, setSelectedStreamingServices] =
		React.useState<string[]>([]);

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
		if (!imageSet) return PlaceholderPoster;
		const prefersDarkScheme = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
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
			const movieData = {
				movieId: movie.imdbId,
				title: movie.title,
				poster: movie.poster || '',
				genres: movie.genres || [],
				releaseYear: movie.releaseYear || null,
				synopsis: movie.synopsis || null,
				runtime: movie.runtime || null,
				cast: movie.cast || [],
				directors: movie.directors || [],
				producers: movie.producers || [],
				streaming: movie.streaming || [],
			};

			const backendUrl =
				import.meta.env.VITE_API_BASE_URL ||
				'https://www.pickflick.app';
			const response = await axios.post(
				`${backendUrl}/api/movies/save`,
				movieData,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);

			console.log('Movie saved successfully:', response.data);
			navigate('/saved-movies');
		} catch (error) {
			console.error('Failed to save movie:', error);
			if (axios.isAxiosError(error)) {
				alert(error.response?.data?.message || 'Failed to save movie.');
			} else {
				alert('An unexpected error occurred.');
			}
		}
	};

	const handleMarkAsWatched = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/auth/login');
			return;
		}

		try {
			const backendUrl =
				import.meta.env.VITE_API_BASE_URL ||
				'https://www.pickflick.app';
			const response = await axios.put(
				`${backendUrl}/api/movies/watched`,
				{
					movieId: movie.imdbId,
					status: 1,
				},
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);

			console.log('Movie marked as watched:', response.data);
			alert('Movie marked as watched successfully!');
		} catch (error) {
			console.error('Failed to mark movie as watched:', error);
			if (axios.isAxiosError(error)) {
				alert(
					error.response?.data?.message ||
						'Failed to mark movie as watched.'
				);
			} else {
				alert('An unexpected error occurred.');
			}
		}
	};

	const handleFetchMovieByStreaming = async () => {
		try {
			const backendUrl =
				import.meta.env.VITE_API_BASE_URL ||
				'https://www.pickflick.app';
			const response = await axios.get(
				`${backendUrl}/api/movies/random-streaming`,
				{
					params: {
						streamingService: selectedStreamingServices.join(','),
						genre: movie.genres?.join(','),
						startYear: movie.releaseYear,
						language:
							movie.language === 'any'
								? undefined
								: movie.language,
					},
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.data) {
				// Handle the response data
				console.log('Streaming movie data:', response.data);
				// You might want to update the movie state or navigate to a new page here
			}
		} catch (error) {
			console.error('Error fetching streaming movie:', error);
			if (axios.isAxiosError(error)) {
				alert(
					error.response?.data?.message ||
						'Failed to fetch streaming movie.'
				);
			} else {
				alert('An unexpected error occurred.');
			}
		}
	};

	const handleStreamingServiceSelect = (service: string) => {
		setSelectedStreamingServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service]
		);
	};

	const handleLoginRegister = () => {
		navigate('/auth/login');
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
						<>
							<button
								className='button save-movie-button'
								onClick={handleSaveMovie}>
								Save Movie
							</button>
							<button
								className='button mark-as-watched-button'
								onClick={handleMarkAsWatched}>
								Mark as Watched
							</button>
						</>
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
							<strong>
								{movie.genres?.join(', ') ||
									'Genre not available'}
							</strong>
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
									{option.link ? (
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
									) : (
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
									)}
								</li>
							))}
						</ul>
					) : (
						<p>No streaming options available.</p>
					)}
				</div>
				<div className='streaming-service-selector'>
					<h3>Select Streaming Services:</h3>
					{[
						'netflix',
						'prime',
						'disney',
						'hbo',
						'hulu',
						'peacock',
						'paramount',
						'apple',
						'mubi',
						'showtime',
						'starz',
					].map((service) => (
						<button
							key={service}
							onClick={() =>
								handleStreamingServiceSelect(service)
							}
							className={`streaming-service-button ${
								selectedStreamingServices.includes(service)
									? 'selected'
									: ''
							}`}>
							{service}
						</button>
					))}
				</div>
				<button
					className='button fetch-streaming-movie-button'
					onClick={handleFetchMovieByStreaming}>
					Find Streaming Movie
				</button>
			</div>
		</div>
	);
};

export default MovieDisplay;
