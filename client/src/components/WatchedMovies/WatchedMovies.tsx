import React, { useState, useEffect } from 'react';

interface WatchedMovie {
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

interface WatchedMoviesProps {
	watchedMovies: WatchedMovie[];
	removeWatchedMovie: (id: string) => void;
}

const WatchedMovies: React.FC<WatchedMoviesProps> = ({
	watchedMovies,
	removeWatchedMovie,
}) => {
	const [isLightTheme, setIsLightTheme] = useState(
		window.matchMedia('(prefers-color-scheme: light)').matches
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
		const handleChange = (event: MediaQueryListEvent) => {
			setIsLightTheme(event.matches);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	const getStreamingImage = (imageSet: {
		lightThemeImage: string;
		darkThemeImage: string;
	}) => {
		return isLightTheme
			? imageSet.lightThemeImage
			: imageSet.darkThemeImage;
	};

	return (
		<div className='watched-movies-container'>
			<h2>Watched Movies</h2>
			{watchedMovies.length === 0 ? (
				<p>No movies watched yet.</p>
			) : (
				<ul>
					{watchedMovies.map((movie) => (
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
									onClick={() =>
										removeWatchedMovie(movie.movieId)
									}>
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

export default WatchedMovies;
