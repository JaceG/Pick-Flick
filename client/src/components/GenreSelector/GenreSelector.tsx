import React from 'react';
import GenreButton from '../GenreButton/GenreButton';
import SelectedGenres from '../SelectedGenres/SelectedGenres';
import { genreOptions } from '../../../constants/genreOptions';

interface GenreSelectorProps {
	selectedGenres: string[];
	setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
	selectedGenres,
	setSelectedGenres,
}) => {
	return (
		<>
			<div className='genres-container'>
				{genreOptions.map((option) => (
					<GenreButton
						key={option.id}
						option={option}
						handleGenreClick={(genreId) => {
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
		</>
	);
};

export default GenreSelector;
