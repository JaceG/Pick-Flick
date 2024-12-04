import React from 'react';
import '../../styles/Button.css';
import GenreButton from '../GenreButton/GenreButton';
import SelectedGenres from '../SelectedGenres/SelectedGenres';
import YearRangeSlider from '../YearRangeSlider/YearRangeSlider';
import RuntimeRangeSlider from '../RuntimeRangeSlider/RuntimeRangeSlider';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import MovieDisplay from '../Movie/MovieDisplay/MovieDisplay';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { genreOptions } from '../../../constants/genreOptions';

interface MainPageProps {
	selectedGenres: string[]; // Use string[] as genre IDs are strings
	yearRange: [number, number];
	runtimeRange: [number, number];
	selectedLanguage: string;
	setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>; // React state dispatcher
	setYearRange: React.Dispatch<React.SetStateAction<[number, number]>>; // React state dispatcher
	setRuntimeRange: React.Dispatch<React.SetStateAction<[number, number]>>; // React state dispatcher
	setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>; // React state dispatcher
	loading: boolean;
	error: string | null;
	movie: any; // Replace with a specific movie type if available
	handleRangeChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		range: [number, number],
		setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
		index: number
	) => void; // Update type to match usage
	handleFetchMovie: () => void;
	transformMovieStreaming: (streaming: any[]) => any[]; // Replace with specific type if available
}

const MainPage: React.FC<MainPageProps> = ({
	selectedGenres,
	yearRange,
	runtimeRange,
	selectedLanguage,
	setSelectedGenres,
	setYearRange,
	setRuntimeRange,
	setSelectedLanguage,
	loading,
	error,
	movie,
	handleRangeChange,
	handleFetchMovie,
	transformMovieStreaming,
}) => {
	return (
		<>
			{/* Genre Selection */}
			<div className='genres-container'>
				{genreOptions.map((option) => (
					<GenreButton
						key={option.id}
						option={option}
						handleGenreClick={(genreId) => {
							// Ensure type safety and avoid type mismatch
							setSelectedGenres((prev) =>
								prev.includes(genreId)
									? prev.filter((id) => id !== genreId)
									: [...prev, genreId]
							);
						}}
						isSelected={selectedGenres.includes(option.id)}
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
						streaming: transformMovieStreaming(movie.streaming),
					}}
				/>
			)}
		</>
	);
};

export default MainPage;
