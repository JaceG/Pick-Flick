import * as React from "react";

// Props interface defining the structure of the genre button component
interface GenreButtonProps {
  option: { id: string; name: string }; // Genre data with ID and name
  handleGenreClick: (genreId: string) => void; // Callback for click events
  isSelected: boolean; // Indicates if the genre is currently selected
}

// Functional component for rendering a genre button
const GenreButton: React.FC<GenreButtonProps> = ({ option, handleGenreClick, isSelected }) => {
  return (
    <button
    className={`genre-button ${isSelected ? "selected" : ""}`} // Styling class
      draggable // Makes the button draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", option.id)} // Handles drag event
      onClick={() => handleGenreClick(option.id)} // Handles click event
      aria-label={`Select ${option.name} genre`} // Accessibility label for screen readers
      aria-pressed={isSelected} // Reflect selected state for screen readers
    >
      {option.name} {/* Display the genre name */}
    </button>
  );
};

export default GenreButton; // Export the component for use in other files