import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

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
	const location = useLocation();

	// Function to get the appropriate streaming image based on theme
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

	useEffect(() => {
		const fetchSavedMovies = async () => {
			const token = localStorage.getItem('token');

			if (!token) {
				setError('No token found. Please log in.');
				setLoading(false);
				return;
			}

			try {
				const response = await axios.get(
					`${API_BASE_URL}/api/movies/saved`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setMovies(response.data);
			} catch (error: any) {
				console.error('Error fetching saved movies:', error);

				if (axios.isAxiosError(error) && error.response) {
					setError(
						error.response.data.message ||
							'Failed to fetch saved movies.'
					);
				} else {
					setError('An unexpected error occurred.');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchSavedMovies();
	}, [location]);

	const handleDeleteMovie = async (movieId: string) => {
		const token = localStorage.getItem('token');

		if (!token) {
			setError('No token found. Please log in.');
			return;
		}

		try {
			await axios.delete(`${API_BASE_URL}/api/movies/saved/${movieId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setMovies((prevMovies) =>
				prevMovies.filter((movie) => movie.movieId !== movieId)
			);
		} catch (error: any) {
			console.error('Error deleting movie:', error);

			if (axios.isAxiosError(error) && error.response) {
				setError(
					error.response.data.message || 'Failed to delete movie.'
				);
			} else {
				setError('An unexpected error occurred.');
			}
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<div>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div>
			<h1>Saved Movies</h1>
			{movies.length === 0 ? (
				<p>No saved movies found.</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{movies.map((movie) => (
						<li
							key={movie.movieId}
							style={{
								border: '1px solid #ccc',
								padding: '10px',
								marginBottom: '10px',
							}}>
							<h2>{movie.title}</h2>
							<img
								src={movie.poster}
								alt={`Poster of ${movie.title}`}
								style={{ width: '150px', height: 'auto' }}
							/>
							<p>
								<strong>Genres:</strong>{' '}
								{movie.genres?.join(', ') || 'N/A'}
							</p>
							<p>
								<strong>Release Year:</strong>{' '}
								{movie.releaseYear || 'N/A'}
							</p>
							<p>
								<strong>Synopsis:</strong>{' '}
								{movie.synopsis || 'N/A'}
							</p>
							<p>
								<strong>Runtime:</strong>{' '}
								{movie.runtime
									? `${Math.floor(movie.runtime / 60)}h ${
											movie.runtime % 60
									  }m`
									: 'Not Available'}
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
															style={{
																width: '100px',
																height: 'auto',
																objectFit:
																	'contain',
															}}
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
								style={{
									backgroundColor: 'red',
									color: 'white',
									border: 'none',
									padding: '5px 10px',
									cursor: 'pointer',
								}}>
								Remove
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SavedMovies;
