import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortFilterControls from '../../SortFilterControls/SortFilterControls';
import { Movie } from '../../../types/movieTypes'; // Use the shared Movie interface
import { sortMovies, filterMovies } from '../../../utils/movieUtils';
import './SavedMovies.css';

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || window.location.origin;

const SavedMovies: React.FC = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for sorting and filtering
	const [sortOption, setSortOption] = useState<string>('title');
	const [filterOption, setFilterOption] = useState<string>('all');

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
	}, []);

	// Apply sorting and filtering
	const displayedMovies = filterMovies(
		sortMovies(movies, sortOption),
		filterOption
	);

	// If handleDeleteMovie is unused, you can remove this function. Otherwise, implement it.
	const handleDeleteMovie = async (movieId: string) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found. Please log in.');

			await axios.delete(`${API_BASE_URL}/api/movies/saved/${movieId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMovies((prevMovies) =>
				prevMovies.filter((movie) => movie.movieId !== movieId)
			);
		} catch (error) {
			console.error('Error deleting movie:', error);
			alert('Failed to delete movie. Please try again.');
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<h1>Saved Movies</h1>
			<SortFilterControls
				sortOption={sortOption}
				setSortOption={setSortOption}
				filterOption={filterOption}
				setFilterOption={setFilterOption}
				availableGenres={['Action', 'Drama', 'Comedy']} // Replace with dynamic genres if needed
			/>
			{displayedMovies.length === 0 ? (
				<p>No movies found.</p>
			) : (
				<ul>
					{displayedMovies.map((movie) => (
						<li key={movie.movieId}>
							<h2>{movie.title}</h2>
							<img
								src={movie.poster || '/path/to/placeholder.jpg'}
								alt={`Poster for ${movie.title}`}
								width='150'
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
							{/* Add the delete button if handleDeleteMovie is needed */}
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
