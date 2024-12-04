import React, { useState, useEffect } from 'react';
import SaveMovieButton from '../SaveMovieButton/SaveMovieButton';
import StreamingOptions from '../StreamingOptions/StreamingOptions';
import './MovieDisplay.css';
import languageMap from '../../../../constants/languageMap';
import PlaceholderPoster from '../../../../../assets/img/placeholder.jpg';

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
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect(() => {
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

	const languageFullName = languageMap[movie.language] || movie.language;

	// Ensure `streaming` data matches the stricter expected structure
	const adjustedStreaming = movie.streaming?.map((option) => ({
		...option,
		service: {
			...option.service,
			imageSet: option.service.imageSet || {
				lightThemeImage: '', // Default value if missing
				darkThemeImage: '',
			},
		},
	}));

	return (
		<div className='movie-container'>
			{/* Movie Poster */}
			<img
				className='movie-poster'
				src={movie.poster || PlaceholderPoster}
				alt={`Movie poster for ${movie.title}`}
			/>

			{/* Movie Details */}
			<div className='movie-details'>
				<div className='button-container'>
					<SaveMovieButton
						movieData={{
							...movie,
							movieId: movie.imdbId, // Map `imdbId` to `movieId`
							streaming: adjustedStreaming, // Use adjusted streaming data
						}}
						isLoggedIn={isLoggedIn}
					/>
				</div>

				{/* Movie Title */}
				<h2 className='movie-title'>{movie.title}</h2>

				{/* Meta Information */}
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

				{/* Synopsis */}
				{movie.synopsis && (
					<p>
						<strong>Synopsis:</strong> {movie.synopsis}
					</p>
				)}

				{/* Cast */}
				{movie.cast && (
					<p>
						<strong>Cast:</strong> {movie.cast.join(', ')}
					</p>
				)}

				{/* Directors */}
				{movie.directors && (
					<p>
						<strong>Directors:</strong> {movie.directors.join(', ')}
					</p>
				)}

				{/* Producers */}
				{movie.producers && (
					<p>
						<strong>Producers:</strong> {movie.producers.join(', ')}
					</p>
				)}

				{/* Streaming Options */}
				<div className='movie-streaming'>
					<strong>Streaming Options:</strong>
					<StreamingOptions streaming={adjustedStreaming} />
				</div>
			</div>
		</div>
	);
};

export default MovieDisplay;
