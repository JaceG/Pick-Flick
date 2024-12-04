import React from 'react';
import './SelectedGenres.css';

interface SelectedGenresProps {
	selectedGenres: string[];
	genreOptions: { id: string; name: string }[];
	setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedGenres: React.FC<SelectedGenresProps> = ({
	selectedGenres,
	genreOptions,
	setSelectedGenres,
}) => {
	return (
		<div>
			<div
				className='selected-genres-container'
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault();
					const genreId = e.dataTransfer.getData('text/plain');
					if (
						!selectedGenres.includes(genreId) &&
						selectedGenres.length < 3
					) {
						setSelectedGenres((prev) => [...prev, genreId]);
					}
				}}>
				{selectedGenres.length === 0 ? (
					<p>
						No genres selected yet. Click, Tap, Or Drag and drop to
						add!
					</p>
				) : (
					selectedGenres.map((genreId) => {
						const genreName =
							genreOptions.find((g) => g.id === genreId)?.name ||
							'Unknown';
						return (
							<div key={genreId} className='selected-genre'>
								{genreName}
								<button
									type='button'
									onClick={() =>
										setSelectedGenres((prev) =>
											prev.filter((id) => id !== genreId)
										)
									}
									className='remove-genre-button'>
									&times;
								</button>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default SelectedGenres;
