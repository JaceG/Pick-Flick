import React from 'react';
import {
	Routes,
	Route,
	Link,
	useNavigate,
	useLocation,
} from 'react-router-dom'; // Import necessary components
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
import AutoLogoutHandler from './utils/AutoLogoutHandler'; // Import AutoLogoutHandler
import SavedMovies from './components/SavedMovies/SavedMovies'; // Import SavedMovies component

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

	// Function to transform the movie data's streaming property to the expected structure
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
