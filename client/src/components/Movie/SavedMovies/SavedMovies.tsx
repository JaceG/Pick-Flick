import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SavedMovies.css';

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
				<ul>
					{movies.map((movie) => (
						<li key={movie.movieId}>
							<h2>{movie.title}</h2>
							<img
								src={movie.poster}
								alt={`Poster of ${movie.title}`}
							/>
							<p>Genres: {movie.genres.join(', ') || 'N/A'}</p>
							<p>Release Year: {movie.releaseYear || 'N/A'}</p>
							<p>Runtime: {movie.runtime || 'N/A'}</p>
							<button
								onClick={() =>
									handleDeleteMovie(movie.movieId)
								}>
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
