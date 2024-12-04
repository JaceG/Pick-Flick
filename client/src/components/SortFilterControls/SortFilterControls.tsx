import React from 'react';

interface SortFilterControlsProps {
	sortOption: string;
	setSortOption: React.Dispatch<React.SetStateAction<string>>;
	filterOption: string;
	setFilterOption: React.Dispatch<React.SetStateAction<string>>;
	availableGenres: string[]; // List of genres to populate the filter dropdown
}

const SortFilterControls: React.FC<SortFilterControlsProps> = ({
	sortOption,
	setSortOption,
	filterOption,
	setFilterOption,
	availableGenres,
}) => {
	return (
		<div className='controls'>
			{/* Sorting Dropdown */}
			<select
				onChange={(e) => setSortOption(e.target.value)}
				value={sortOption}
				className='sort-dropdown'>
				<option value='title'>Sort by Title</option>
				<option value='year'>Sort by Year</option>
				<option value='runtime'>Sort by Runtime</option>
			</select>

			{/* Filtering Dropdown */}
			<select
				onChange={(e) => setFilterOption(e.target.value)}
				value={filterOption}
				className='filter-dropdown'>
				<option value='all'>All Genres</option>
				{availableGenres.map((genre) => (
					<option key={genre} value={genre}>
						{genre}
					</option>
				))}
			</select>
		</div>
	);
};

export default SortFilterControls;
