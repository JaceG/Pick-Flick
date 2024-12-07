import React from 'react';
import './SavedMovies.css';

interface Movie {
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
				lightThemeImage: string;
				darkThemeImage: string;
			};
		};
	}[];
}

interface SavedMoviesProps {
	movies: Movie[];
	onMarkAsWatched: (movie: Movie) => void;
	onDeleteMovie: (movieId: string) => void;
}

const SavedMovies: React.FC<SavedMoviesProps> = ({
	movies,
	onMarkAsWatched,
	onDeleteMovie,
}) => {
	// Helper function to get the appropriate streaming image based on theme
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

	const handleMarkAsWatched = (movie: Movie) => {
		onMarkAsWatched(movie);
	};

	return (
		<div>
			<h1>Saved Movies</h1>
			{movies.length === 0 ? (
				<p>No saved movies found.</p>
			) : (
				<ul>
					{movies.map((movie) => (
						<li key={movie.movieId} className='movie-item'>
							<h2>{movie.title}</h2>
							<img
								src={movie.poster}
								alt={`Poster of ${movie.title}`}
								className='movie-poster'
							/>
							<p>
								<strong>Genres:</strong>{' '}
								{movie.genres?.join(', ') || 'N/A'}
							</p>
							<p>
								<strong>Release Year:</strong>{' '}
								{movie.releaseYear || 'N/A'}
							</p>
							<div className='movie-streaming'>
								<p>
									<strong>Streaming Options:</strong>
								</p>
								{movie.streaming &&
								movie.streaming.length > 0 ? (
									<ul>
										{movie.streaming.map(
											(option, index) => (
												<li key={index}>
													<a
														href={option.link}
														target='_blank'
														rel='noopener noreferrer'>
														<img
															src={getStreamingImage(
																option.service
																	.imageSet
															)}
															alt={`Streaming option ${
																index + 1
															}`}
														/>
													</a>
												</li>
											)
										)}
									</ul>
								) : (
									<p>No streaming options available.</p>
								)}
							</div>
							<div className='movie-actions'>
								<button
									onClick={() => handleMarkAsWatched(movie)}
									className='mark-as-watched'>
									Mark as Watched
								</button>
								<button
									onClick={() => onDeleteMovie(movie.movieId)}
									className='remove'>
									Remove
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SavedMovies;
