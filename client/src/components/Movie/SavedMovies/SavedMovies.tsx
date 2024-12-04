import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SavedMovies.css';
import PlaceholderPoster from '../../../../../assets/img/placeholder.jpg';

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || window.location.origin;

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

const SavedMovies: React.FC = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSavedMovies = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('No token found. Please log in.');
				}

				const response = await axios.get(
					`${API_BASE_URL}/api/movies/saved`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setMovies(response.data);
			} catch (err: any) {
				setError(
					axios.isAxiosError(err) && err.response
						? err.response.data.message || 'Failed to fetch movies.'
						: 'An unexpected error occurred.'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchSavedMovies();
	}, []);

	const handleDeleteMovie = async (movieId: string) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found. Please log in.');
			}

			await axios.delete(`${API_BASE_URL}/api/movies/saved/${movieId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMovies((prev) =>
				prev.filter((movie) => movie.movieId !== movieId)
			);
		} catch (err: any) {
			alert(
				axios.isAxiosError(err) && err.response
					? err.response.data.message || 'Failed to delete movie.'
					: 'An unexpected error occurred.'
			);
		}
	};

	const getStreamingImage = (imageSet: {
		lightThemeImage?: string;
		darkThemeImage?: string;
	}) => {
		const prefersDarkScheme = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		return prefersDarkScheme
			? imageSet.darkThemeImage || ''
			: imageSet.lightThemeImage || '';
	};

	return (
		<div>
			<h1>Saved Movies</h1>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : movies.length === 0 ? (
				<p>No saved movies found.</p>
			) : (
				<ul className='saved-movies-list'>
					{movies.map((movie) => (
						<li key={movie.movieId} className='saved-movie-item'>
							<h2>{movie.title}</h2>
							<img
								src={movie.poster || PlaceholderPoster}
								alt={`Poster of ${movie.title}`}
								className='movie-poster'
							/>
							<p>
								<strong>Genres:</strong>{' '}
								{movie.genres.join(', ')}
							</p>
							<p>
								<strong>Release Year:</strong>{' '}
								{movie.releaseYear || 'N/A'}
							</p>
							<p>
								<strong>Runtime:</strong>{' '}
								{movie.runtime
									? `${Math.floor(movie.runtime / 60)}h ${
											movie.runtime % 60
									  }m`
									: 'N/A'}
							</p>
							<p>
								<strong>Synopsis:</strong>{' '}
								{movie.synopsis || 'N/A'}
							</p>
							<p>
								<strong>Cast:</strong>{' '}
								{movie.cast?.join(', ') || 'N/A'}
							</p>
							<p>
								<strong>Directors:</strong>{' '}
								{movie.directors?.join(', ') || 'N/A'}
							</p>
							<p>
								<strong>Producers:</strong>{' '}
								{movie.producers?.join(', ') || 'N/A'}
							</p>
							<div className='movie-streaming'>
								<strong>Streaming Options:</strong>
								{movie.streaming &&
								movie.streaming.length > 0 ? (
									<ul className='streaming-options'>
										{movie.streaming.map(
											(option, index) => (
												<li
													key={index}
													className='streaming-option'>
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
															className='streaming-image'
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
							<button
								onClick={() => handleDeleteMovie(movie.movieId)}
								className='delete-button'>
								Remove x
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SavedMovies;
