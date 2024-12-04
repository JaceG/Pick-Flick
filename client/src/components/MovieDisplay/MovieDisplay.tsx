import * as React from 'react';
import PlaceholderPoster from '../../../../assets/img/placeholder.jpg';
import languageMap from '../../../constants/languageMap';

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
											src={getStreamingImage(
												option.service.imageSet
											)}
											width={200}
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

export default MovieDisplay; // Export the component for use in other files
