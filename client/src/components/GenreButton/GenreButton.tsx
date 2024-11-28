import * as React from "react";

// Props interface defining the structure of the genre button component
interface GenreButtonProps {
  option: { id: string; name: string }; // Genre data with ID and name
  handleGenreClick: (genreId: string) => void; // Callback for click events
}

// Functional component for rendering a genre button
const GenreButton: React.FC<GenreButtonProps> = ({ option, handleGenreClick }) => {
  return (
    <button
      className="genre-button" // Styling class
      draggable // Makes the button draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", option.id)} // Handles drag event
      onClick={() => handleGenreClick(option.id)} // Handles click event
    >
      {option.name} {/* Display the genre name */}
    </button>
  );
};

export default GenreButton; // Export the component for use in other files
