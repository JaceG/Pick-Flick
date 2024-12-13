<<<<<<< Updated upstream
import React from 'react';
import {
	Routes,
	Route,
	Link,
	useNavigate,
	useLocation,
} from 'react-router-dom'; // Import necessary components
=======
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
>>>>>>> Stashed changes
import './App.css';
import GenreButton from './components/GenreButton/GenreButton';
import SelectedGenres from './components/SelectedGenres/SelectedGenres';
import YearRangeSlider from './components/YearRangeSlider/YearRangeSlider';
import RuntimeRangeSlider from './components/RuntimeRangeSlider/RuntimeRangeSlider';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import MovieDisplay from './components/MovieDisplay/MovieDisplay';
import Spinner from './components/Spinner/Spinner';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import AuthPage from './components/Auth/AuthPage/AuthPage';
import { useMovieState } from './hooks/useMovieState';
import { genreOptions } from '../constants/genreOptions';
<<<<<<< Updated upstream
import AutoLogoutHandler from './utils/AutoLogoutHandler'; // Import AutoLogoutHandler
import SavedMovies from './components/SavedMovies/SavedMovies'; // Import SavedMovies component
=======
import AutoLogoutHandler from './utils/AutoLogoutHandler';
import SavedMovies from './components/SavedMovies/SavedMovies';
import WatchedMovies from './components/WatchedMovies/WatchedMovies';
import axios from 'axios';

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || window.location.origin;

// Movie type interface
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

// WatchedMovie type interface (updated to match the one used in WatchedMovies component)
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
>>>>>>> Stashed changes

const App: React.FC = () => {
	const {
		movie,
		loading,
		error,
		loggedIn,
		selectedGenres,
		yearRange,
		runtimeRange,
		selectedLanguage,
		setLoggedIn,
		setSelectedGenres,
		setYearRange,
		setRuntimeRange,
		setSelectedLanguage,
		handleRangeChange,
		handleFetchMovie,
	} = useMovieState();

	const navigate = useNavigate(); // Initialize useNavigate
	const location = useLocation(); // Initialize useLocation

<<<<<<< Updated upstream
	// Function to transform the movie data's streaming property to the expected structure
=======
	// Automatically set theme based on time of day
	useEffect(() => {
		const hour = new Date().getHours();
		const theme = hour >= 7 && hour <= 19 ? 'light' : 'dark';
		document.documentElement.className = theme;
	}, []);

	// Set loggedIn state based on token in localStorage
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setLoggedIn(true);
		}
	}, [setLoggedIn]);

	// Fetch saved movies from the API
	useEffect(() => {
		const fetchSavedMovies = async () => {
			const token = localStorage.getItem('token');

			if (!token) {
				console.error('No token found. Please log in.');
				return;
			}

			try {
				const response = await axios.get(
					`${API_BASE_URL}/api/movies/saved`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setSavedMovies(response.data);
			} catch (err: any) {
				if (axios.isAxiosError(err) && err.response) {
					console.error(
						err.response.data.message ||
							'Failed to fetch saved movies.'
					);
				} else {
					console.error('An unexpected error occurred.');
				}
			}
		};

		fetchSavedMovies();
	}, [location]);

	// Fetch watched movies from the API
	useEffect(() => {
		const fetchWatchedMovies = async () => {
			const token = localStorage.getItem('token');

			if (!token) {
				console.error('No token found. Please log in.');
				return;
			}

			try {
				const response = await axios.get(
					`${API_BASE_URL}/api/movies/watched`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				console.log('Watched movies:', response.data);
				setWatchedMovies(
					response.data?.map((data: any) => ({
						movieId: data.movieId,
						title: data.title,
						poster: data.poster,
						genres: data.genres,
						releaseYear: data.releaseYear,
						synopsis: data.synopsis,
						runtime: data.runtime,
						cast: data.cast,
						directors: data.directors,
						producers: data.producers,
						streaming: data.streaming,
					}))
				);
			} catch (err: any) {
				if (axios.isAxiosError(err) && err.response) {
					console.error(
						err.response.data.message ||
							'Failed to fetch watched movies.'
					);
				} else {
					console.error('An unexpected error occurred.');
				}
			}
		};

		fetchWatchedMovies();
	}, [location]);

	const saveWatchedMovies = async (id: string, status: number = 1) => {
		const token = localStorage.getItem('token');
		try {
			const response = await axios.put(
				`${API_BASE_URL}/api/movies/watched`,
				{
					movieId: id,
					status: status,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log('Registration response:', response);
		} catch (err: any) {
			console.error('Error during registration:', err);
			alert(
				err.response?.data?.message ||
					'An error occurred during registration.'
			);
		}
	};

	// Add movie to watched list and remove from saved list
	const addToWatchedMovies = (movie: Movie) => {
		const watchedMovie: WatchedMovie = {
			movieId: movie.movieId,
			title: movie.title,
			poster: movie.poster || '',
			genres: movie.genres,
			releaseYear: movie.releaseYear || 'N/A',
			synopsis: movie.synopsis,
			runtime: movie.runtime,
			cast: movie.cast,
			directors: movie.directors,
			producers: movie.producers,
			streaming: movie.streaming,
		};
		setWatchedMovies((prev) => [...prev, watchedMovie]);
		setSavedMovies((prev) =>
			prev.filter((m) => m.movieId !== movie.movieId)
		);
		saveWatchedMovies(movie?.movieId ?? '');
	};

	// Remove movie from watched list
	const removeWatchedMovie = (id: string) => {
		deleteSavedMovie(id, true);
	};

	// Delete a movie from the saved list
	const deleteSavedMovie = async (
		movieId: string,
		watched: boolean = false
	) => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No token found. Please log in.');
			return;
		}

		try {
			await axios.delete(`${API_BASE_URL}/api/movies/saved/${movieId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (watched) {
				setWatchedMovies((prev) =>
					prev.filter((movie) => (movie?.movieId ?? '') !== movieId)
				);
				return;
			}
			setSavedMovies((prevMovies) =>
				prevMovies.filter((movie) => movie.movieId !== movieId)
			);
		} catch (err: any) {
			if (axios.isAxiosError(err) && err.response) {
				console.error(
					err.response.data.message || 'Failed to delete movie.'
				);
			} else {
				console.error('An unexpected error occurred.');
			}
		}
	};

	// Transform streaming data (dummy implementation if missing)
>>>>>>> Stashed changes
	const transformMovieStreaming = (streaming: any[] = []) =>
		streaming.map((option) => ({
			link: option.link || '',
			service: {
				imageSet: {
					lightThemeImage:
						option.service?.imageSet?.lightThemeImage || '',
					darkThemeImage:
						option.service?.imageSet?.darkThemeImage || '',
				},
			},
		}));

	return (
		<div className='app'>
			{/* AutoLogoutHandler */}
			<AutoLogoutHandler loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

			{/* Header */}
			<header className='app-header'>
				<h1>Random Movie Generator</h1>
				<nav>
					{location.pathname !== '/' && (
						<button
							onClick={() => navigate('/')}
							className='back-button'>
							Back to Home
						</button>
					)}
					{!loggedIn ? (
						<>
							<Link to='/auth/login' className='nav-button'>
								Login
							</Link>
							<Link to='/auth/register' className='nav-button'>
								Register
							</Link>
						</>
					) : (
						<div className='logged-in-icon'>
							<span>👤 Logged In</span>
							<button
<<<<<<< Updated upstream
								onClick={() => {
									setLoggedIn(false);
									localStorage.removeItem('token'); // Clear the token
									navigate('/auth/login'); // Redirect to login
								}}
								className='logout-button'>
								Logout
							</button>
							<Link to='/saved-movies' className='nav-button'>
								Saved Movies
							</Link>
						</div>
					)}
				</nav>
			</header>
=======
								onClick={() => navigate('/')}
								className='nav-button'>
								Back to Home
							</button>
						)}
						{!loggedIn ? (
							<>
								<button
									onClick={() => navigate('/auth/login')}
									className='nav-button'>
									Login
								</button>
								<button
									onClick={() => navigate('/auth/register')}
									className='nav-button'>
									Register
								</button>
							</>
						) : (
							<div className='logged-in-icon'>
								<span>👤 Logged In</span>
								<button
									onClick={() => {
										setLoggedIn(false);
										localStorage.removeItem('token');
										navigate('/auth/login');
									}}
									className='nav-button'>
									Logout
								</button>
								<button
									onClick={() => navigate('/saved-movies')}
									className='nav-button'>
									Saved Movies
								</button>
								<button
									onClick={() => navigate('/watched-movies')}
									className='nav-button'>
									Watched Movies
								</button>
							</div>
						)}
					</nav>
				</header>
>>>>>>> Stashed changes

			{/* Routes */}
			<Routes>
				<Route
					path='/'
					element={
						<>
							{/* Genre Selection */}
							<div className='genres-container'>
								{genreOptions.map((option) => (
									<GenreButton
										key={option.id}
										option={option}
										handleGenreClick={(genreId) =>
											setSelectedGenres((prev) =>
												prev.includes(genreId)
													? prev.filter(
															(id) =>
																id !== genreId
													  )
													: [...prev, genreId]
											)
										}
										isSelected={selectedGenres.includes(
											option.id
										)}
									/>
								))}
							</div>
							<SelectedGenres
								selectedGenres={selectedGenres}
								genreOptions={genreOptions}
								setSelectedGenres={setSelectedGenres}
							/>
							{/* Year Range Slider */}
							<YearRangeSlider
								yearRange={yearRange}
								setYearRange={setYearRange}
								handleRangeChange={handleRangeChange}
							/>
							{/* Runtime Range Slider */}
							<RuntimeRangeSlider
								runtimeRange={runtimeRange}
								setRuntimeRange={setRuntimeRange}
								handleRangeChange={handleRangeChange}
							/>
							{/* Language Selector */}
							<LanguageSelector
								selectedLanguage={selectedLanguage}
								setSelectedLanguage={setSelectedLanguage}
								languageOptions={[
									{ code: 'any', name: 'Any' },
									{ code: 'en', name: 'English' },
									{ code: 'es', name: 'Spanish' },
									{ code: 'zh', name: 'Chinese' },
									{ code: 'fr', name: 'French' },
									{ code: 'de', name: 'German' },
									{ code: 'hi', name: 'Hindi' },
									{ code: 'ar', name: 'Arabic' },
									{ code: 'ru', name: 'Russian' },
									{ code: 'pt', name: 'Portuguese' },
									{ code: 'ja', name: 'Japanese' },
								]}
							/>
							{/* Fetch Movie Button */}
							{loading ? (
								<Spinner />
							) : (
								<button
									className='find-movie-button'
									type='button'
									onClick={(e) => {
										e.preventDefault();
										handleFetchMovie();
									}}>
									Find Me a Movie
								</button>
							)}
							{/* Error Message */}
							{error && <ErrorMessage message={error} />}
							{/* Movie Display */}
							{movie && (
								<MovieDisplay
									movie={{
										...movie,
										streaming: transformMovieStreaming(
											movie.streaming
										),
									}}
								/>
							)}
						</>
					}
				/>
				<Route
					path='/auth/:type'
					element={<AuthPage onLogin={() => setLoggedIn(true)} />}
				/>
				<Route path='/saved-movies' element={<SavedMovies />} />
			</Routes>
		</div>
	);
};

export default App;
