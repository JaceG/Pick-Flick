import { useState } from 'react';

// Define the GenreOption type
type GenreOption = {
	label: string;
	value: string;
};

// Sample genre options
const initialGenreOptions: GenreOption[] = [
	{ label: 'Action', value: 'action' },
	{ label: 'Comedy', value: 'comedy' },
	// add other genres here
];

export const useGenres = () => {
	const [selectedGenres, setSelectedGenres] = useState<GenreOption[]>([]);

	const handleGenreChange = (genre: GenreOption) => {
		setSelectedGenres((prev) =>
			prev.some((g) => g.value === genre.value)
				? prev.filter((g) => g.value !== genre.value)
				: [...prev, genre]
		);
	};

	return {
		selectedGenres,
		handleGenreChange,
		initialGenreOptions,
	};
};
