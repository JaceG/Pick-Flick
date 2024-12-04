import React from 'react';
import { useGenres } from '../../hooks/UseGenres';

const GenreSelector: React.FC = () => {
	const { selectedGenres, handleGenreChange, initialGenreOptions } =
		useGenres();

	return (
		<div>
			{initialGenreOptions.map((genre) => (
				<button
					key={genre.value}
					onClick={() => handleGenreChange(genre)}
					style={{
						backgroundColor: selectedGenres.some(
							(g) => g.value === genre.value
						)
							? 'blue'
							: 'gray',
					}}>
					{genre.label}
				</button>
			))}
		</div>
	);
};

export default GenreSelector;
