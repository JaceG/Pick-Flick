import React, { useState } from 'react';
import '../../styles/Button.css';
import GenreSelector from '../GenreSelector/GenreSelector';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import YearRangeSlider from '../YearRangeSlider/YearRangeSlider';
import RuntimeRangeSlider from '../RuntimeRangeSlider/RuntimeRangeSlider';
import MovieDisplay from '../Movie/MovieDisplay/MovieDisplay';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

interface MainPageProps {
	yearRange: [number, number];
	runtimeRange: [number, number];
	selectedLanguage: string;
	setYearRange: React.Dispatch<React.SetStateAction<[number, number]>>;
	setRuntimeRange: React.Dispatch<React.SetStateAction<[number, number]>>;
	setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
	loading: boolean;
	error: string | null;
	movie: any;
	handleRangeChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		range: [number, number],
		setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
		index: number
	) => void;
	handleFetchMovie: () => void;
	transformMovieStreaming: (streaming: any[]) => any[];
}

const MainPage: React.FC<MainPageProps> = ({
	yearRange,
	runtimeRange,
	selectedLanguage,
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
	// State for managing selected genres
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

	return (
		<>
			{/* Genre Selector */}
			<GenreSelector
				selectedGenres={selectedGenres}
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
