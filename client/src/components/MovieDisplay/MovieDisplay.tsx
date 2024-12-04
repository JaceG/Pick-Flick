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
	};
}

const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie }) => {
	const languageFullName = languageMap[movie.language] || movie.language;
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(
		Boolean(localStorage.getItem('token'))
	);

	// Dynamically check login status
	React.useEffect(() => {
		const checkLoginStatus = () => {
			setIsLoggedIn(Boolean(localStorage.getItem('token')));
		};

		window.addEventListener('storage', checkLoginStatus);

		return () => {
			window.removeEventListener('storage', checkLoginStatus);
		};
	}, []);

	// Function to save the movie
	const handleSaveMovie = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			// Redirect to register page if no token
			navigate('/auth/register');
			return;
		}

		try {
			const movieData = {
				movieId: movie.imdbId,
				title: movie.title,
				poster: movie.poster,
				genres: movie.genres,
			};

			await axios.post(
				'http://localhost:3001/api/movies/save',
				movieData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Redirect to Saved Movies page on success
			navigate('/saved-movies');
		} catch (error) {
			console.error('Failed to save movie:', error);

			if (axios.isAxiosError(error)) {
				if (error.response) {
					alert(`Error: ${error.response.data.message}`);
				} else {
					alert('An unexpected error occurred. Please try again.');
				}
			} else {
				alert('An unexpected error occurred.');
			}
		}
	};

	// Function to handle the login/signup action
	const handleLoginSignup = () => {
		navigate('/auth/register');
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
					{/* Conditionally render buttons */}
					{isLoggedIn ? (
						<button
							className='button save-movie-button'
							onClick={handleSaveMovie}>
							Save Movie
						</button>
					) : (
						<button
							className='button login-register-button'
							onClick={handleLoginSignup}>
							Login/Register to Save Movie
						</button>
					)}
				</div>
				<h2 className='movie-title'>{movie.title}</h2>
				<div className='movie-meta'>
					<p className='movie-genres'>
						<strong>{movie.genres.join(', ')}</strong>
					</p>
					<p className='movie-release'>
						<strong>Release Year:</strong> {movie.releaseYear}
					</p>
				</div>
				<div className='movie-language'>
					<p>
						<strong>Language:</strong> {languageFullName}
					</p>
				</div>
				<div className='movie-runtime'>
					<strong>Runtime:</strong>{' '}
					{movie.runtime
						? `${Math.floor(movie.runtime / 60)}h ${
								movie.runtime % 60
						  }m`
						: 'Not Available'}
				</div>
				<div className='movie-synopsis'>
					<p>
						<strong>Synopsis:</strong> {movie.synopsis}
					</p>
				</div>
				<div className='movie-credits'>
					<p>
						<strong>Cast:</strong> {movie.cast.join(', ')}
					</p>
					<p>
						<strong>Director(s):</strong>{' '}
						{movie.directors.join(', ')}
					</p>
					<p>
						<strong>Producer(s):</strong>{' '}
						{movie.producers.join(', ')}
					</p>
				</div>
				<div className='movie-imdb'>
					<p>
						<strong>IMDb ID:</strong> {movie.imdbId}
					</p>
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
											src={
												option.service.imageSet
													.lightThemeImage
											}
											className='streaming-image'
											alt={`Streaming option ${
												index + 1
											}`}
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
