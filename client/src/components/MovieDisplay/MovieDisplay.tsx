import * as React from 'react';
import languageMap from '../../../constants/languageMap';
import PlaceholderPoster from '../../../../assets/img/placeholder.jpg';

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
	const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDarkMode(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => {
			setIsDarkMode(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	const languageFullName = languageMap[movie.language] || movie.language;

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
												isDarkMode
													? option.service.imageSet
															.darkThemeImage
													: option.service.imageSet
															.lightThemeImage
											}
											width={200}
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

export default MovieDisplay; // Export the component for use in other files
