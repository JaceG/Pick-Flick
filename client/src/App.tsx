import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [movie, setMovie] = useState<{
    title: string;
    genres: string[];
    releaseYear: string;
    synopsis: string;
    poster: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Track errors

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2020]); // Default year range

  // Genre options
  const genreOptions = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "14", name: "Fantasy" },
    { id: "36", name: "History" },
    { id: "27", name: "Horror" },
    { id: "10402", name: "Music" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Sci-Fi" },
    { id: "10770", name: "TV Movie" },
    { id: "53", name: "Thriller" },
    { id: "10752", name: "War" },
    { id: "37", name: "Western" },
  ];

  const fetchRandomMovie = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3001/api/movies/random", {
        params: {
          genre: selectedGenres.join(","), // Join genres with commas
          startYear: yearRange[0], // Correctly pass startYear
          endYear: yearRange[1],   // Correctly pass endYear
        },
      });
      setMovie(response.data);
    } catch (err) {
      setError("Failed to fetch a random movie. Please try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, genreId: string) => {
    e.dataTransfer.setData("text/plain", genreId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const genreId = e.dataTransfer.getData("text/plain");
    if (!selectedGenres.includes(genreId) && selectedGenres.length < 3) {
      setSelectedGenres((prev) => [...prev, genreId]);
    } else if (selectedGenres.length >= 3) {
      alert("You can only select up to 3 genres.");
    }
    e.dataTransfer.clearData();
  };

  const removeGenre = (genreId: string) => {
    setSelectedGenres((prev) => prev.filter((id) => id !== genreId));
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...yearRange];
    newRange[index] = parseInt(e.target.value, 10);
    if (newRange[0] <= newRange[1]) {
      setYearRange([newRange[0], newRange[1]]);
    }
  };

  return (
    <div className="app">
      <h1>Random Movie Generator</h1>

      {/* Available Genres */}
      <div className="genres-container">
        {genreOptions.map((option) => (
          <button
            key={option.id}
            className="genre-button"
            draggable
            onDragStart={(e) => handleDragStart(e, option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Selected Genres */}
      <div>
        <h2 className="selected-genres-header">Drag And Drop To Select Genres</h2>
        <div
          className="selected-genres-container"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedGenres.map((genreId) => {
            const genreName = genreOptions.find((g) => g.id === genreId)?.name || "Unknown";
            return (
              <div key={genreId} className="selected-genre">
                {genreName}
                <button
                  type="button"
                  onClick={() => removeGenre(genreId)}
                  className="remove-genre-button"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year Range Selector */}
      <div className="year-range-container">
        <label>
          Start Year:
          <input
            type="number"
            min="1900"
            max="2024"
            value={yearRange[0]}
            onChange={(e) => handleRangeChange(e, 0)}
          />
        </label>
        <label>
          End Year:
          <input
            type="number"
            min="1900"
            max="2024"
            value={yearRange[1]}
            onChange={(e) => handleRangeChange(e, 1)}
          />
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="1900"
            max="2024"
            value={yearRange[0]}
            onChange={(e) => handleRangeChange(e, 0)}
            className="slider"
          />
          <input
            type="range"
            min="1900"
            max="2024"
            value={yearRange[1]}
            onChange={(e) => handleRangeChange(e, 1)}
            className="slider"
          />
        </div>
      </div>

      {/* Find Movie Button */}
      <button
        type="button"
        onClick={fetchRandomMovie}
        disabled={loading}
      >
        {loading ? "Loading..." : "Find Me a Movie"}
      </button>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Movie Display */}
      {movie && (
        <div className="movie-container">
          <img className="movie-poster" src={movie.poster} alt={movie.title} />
          <div className="movie-title">{movie.title}</div>
          <div className="movie-genres">{movie.genres.join(", ")}</div>
          <div className="movie-release">Release Year: {movie.releaseYear}</div>
          <div className="movie-synopsis">{movie.synopsis}</div>
        </div>
      )}
    </div>
  );
};

export default App;
