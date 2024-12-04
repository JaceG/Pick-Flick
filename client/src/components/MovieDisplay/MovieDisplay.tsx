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
		imdbId: string; // Add the imdbId property
		streaming: { [key: string]: any }[]; // Add the streaming property
	};
}

// Functional component to display movie details
const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie }) => {
	const languageFullName = languageMap[movie.language] || movie.language;
	const navigate = useNavigate(); // Added useNavigate for navigation
	const [isLoggedIn] = React.useState<boolean>(
		Boolean(localStorage.getItem('token'))
	);

	// Function to get the appropriate image based on the theme
	const getStreamingImage = (imageSet: {
		lightThemeImage: string;
		darkThemeImage: string;
	}) => {
		const prefersDarkScheme = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		return prefersDarkScheme
			? imageSet.darkThemeImage
			: imageSet.lightThemeImage;
	};

	// Function to handle saving the movie
	const handleSaveMovie = async () => {
		const token = localStorage.getItem('token'); // Get the token from localStorage

		try {
			const movieData = {
				movieId: movie.imdbId, // Ensure this is set correctly
				title: movie.title,
				poster: movie.poster,
				genres: movie.genres, // Send genres as an array
			};

			console.log('Movie data being sent:', movieData); // Log the movie data being sent

			const response = await axios.post(
				'http://localhost:3001/api/movies/save',
				movieData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('Movie saved successfully:', response.data);
			navigate('/saved-movies'); // Redirect to Saved Movies page
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// The error is an AxiosError
				console.error('Failed to save movie:', error);
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.error('Response data:', error.response.data);
					console.error('Response status:', error.response.status);
					console.error('Response headers:', error.response.headers);
				} else if (error.request) {
					// The request was made but no response was received
					console.error('Request data:', error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.error('Error message:', error.message);
				}
			} else {
				// The error is not an AxiosError
				console.error('An unexpected error occurred:', error);
			}
		}
	};

	// Function to handle the login/signup action
	const handleLoginSignup = () => {
		navigate('/auth/login'); // Redirect to login/sign-up page
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
					{/* Conditionally render the Save Movie or Login/Signup Button */}
					{isLoggedIn ? (
						<button
							className='button save-movie-button'
							onClick={handleSaveMovie}>
							Save Movie
						</button>
					) : (
						<button
							className='button login-signup-button'
							onClick={handleLoginSignup}>
							Login/Signup To Save Movie
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
											src={getStreamingImage(
												option.service.imageSet
											)}
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
