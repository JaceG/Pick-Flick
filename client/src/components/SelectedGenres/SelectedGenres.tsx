import * as React from "react";

// Props interface for the selected genres component
interface SelectedGenresProps {
  selectedGenres: string[]; // Array of selected genre IDs
  genreOptions: { id: string; name: string }[]; // All available genres
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>; // State updater for selected genres
}

// Functional component for managing selected genres
const SelectedGenres: React.FC<SelectedGenresProps> = ({
  selectedGenres,
  genreOptions,
  setSelectedGenres,
}) => {
  return (
    <div>
      <h2 className="selected-genres-header">Drag And Drop To Select Genres</h2>
      <div
        className="selected-genres-container"
        onDragOver={(e) => e.preventDefault()} // Allow drag-over events
        onDrop={(e) => {
          const genreId = e.dataTransfer.getData("text/plain"); // Get dragged genre ID
          if (!selectedGenres.includes(genreId) && selectedGenres.length < 3) {
            setSelectedGenres((prev) => [...prev, genreId]); // Add genre if not already selected
          }
        }}
      >
        {selectedGenres.map((genreId) => {
          const genreName = genreOptions.find((g) => g.id === genreId)?.name || "Unknown";
          return (
            <div key={genreId} className="selected-genre">
              {genreName} {/* Display the genre name */}
              <button
                type="button"
                onClick={() =>
                  setSelectedGenres((prev) => prev.filter((id) => id !== genreId))
                } // Remove genre on button click
                className="remove-genre-button"
              >
                &times; {/* Close icon */}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedGenres; // Export the component for use in other files
