import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './styles/App.css';
import Header from './components/Header/Header';
import MainPage from './components/MainPage/MainPage';
import AuthHandler from './components/Auth/AuthHandler/AuthHandler';
import AuthPage from './components/Auth/AuthPage/AuthPage';
import SavedMovies from './components/Movie/SavedMovies/SavedMovies';
import { useMovieState } from './hooks/useMovieState';
import { transformMovieStreaming } from './components/Movie/MovieLogic/MovieLogic';

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

	return (
		<div className='app'>
			<AuthHandler loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

			<Routes>
				<Route
					path='/'
					element={
						<MainPage
							selectedGenres={selectedGenres}
							yearRange={yearRange}
							runtimeRange={runtimeRange}
							selectedLanguage={selectedLanguage}
							setSelectedGenres={setSelectedGenres}
							setYearRange={setYearRange}
							setRuntimeRange={setRuntimeRange}
							setSelectedLanguage={setSelectedLanguage}
							loading={loading}
							error={error}
							movie={movie}
							handleRangeChange={handleRangeChange}
							handleFetchMovie={handleFetchMovie}
							transformMovieStreaming={transformMovieStreaming} // Pass the function here
						/>
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
