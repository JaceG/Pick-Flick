import React from 'react';

interface WatchedMovie {
	id: string;
	title: string;
	poster?: string;
	year: string;
	movieId?: string;
}

interface WatchedMoviesProps {
	watchedMovies: WatchedMovie[];
	removeWatchedMovie: (id: string) => void;
}

const WatchedMovies: React.FC<WatchedMoviesProps> = ({
	watchedMovies,
	removeWatchedMovie,
}) => {
	return (
		<div className='watched-movies-container'>
			<h2>Watched Movies</h2>
			{watchedMovies.length === 0 ? (
				<p>No movies watched yet.</p>
			) : (
				<ul>
					{watchedMovies.map((movie) => (
						<li key={movie.id} className='movie-item'>
							<img src={movie.poster} alt={movie.title} />
							<div>
								<h3>
									{movie.title} ({movie.year})
								</h3>
								<button
									onClick={() =>
										removeWatchedMovie(movie.movieId ?? '')
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
