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

	return (
		<div className='movie-container'>
			<img
				className='movie-poster'
				src={movie.poster || PlaceholderPoster}
				alt={`Movie poster for ${movie.title}`}
			/>
			<div className='movie-details'>
				<div className='button-container'>
					<SaveMovieButton
						movieData={movie}
						isLoggedIn={isLoggedIn}
					/>
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
					<StreamingOptions streaming={movie.streaming} />
				</div>
			</div>
		</div>
	);
};

export default MovieDisplay;
