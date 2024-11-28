import * as React from "react";
import { useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [movie, setMovie] = useState<{
    title: string;
    genres: string[];
    releaseYear: string;
    synopsis: string;
    poster: string;
    runtime: number; // Runtime in minutes
    cast: string[]; // Top 5 actors
    directors: string[]; // List of directors
    producers: string[]; // List of producers
    language: string; // Language of the movie
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2020]);
  const [runtimeRange, setRuntimeRange] = useState<[number, number]>([0, 360]); // Default runtime in minutes
  const [selectedLanguage, setSelectedLanguage] = useState<string>("any"); // Default to "Any"

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

  const languageOptions = [
    { code: "any", name: "Any" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "zh", name: "Chinese" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" },
    { code: "ja", name: "Japanese" },
  ];

  const fetchRandomMovie = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies/random`, {
        params: {
          genre: selectedGenres.join(","),
          startYear: yearRange[0],
          endYear: yearRange[1],
          minRuntime: runtimeRange[0],
          maxRuntime: runtimeRange[1],
          language: selectedLanguage === "any" ? undefined : selectedLanguage,
        },
      });
      setMovie(response.data);
    } catch (err) {
      setError("Failed to fetch a random movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    range: [number, number],
    setRange: React.Dispatch<React.SetStateAction<[number, number]>>,
    index: number
  ) => {
    const newRange = [...range];
    newRange[index] = parseInt(e.target.value, 10);
    if (newRange[0] <= newRange[1]) {
      setRange([newRange[0], newRange[1]]);
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
            onDragStart={(e) => e.dataTransfer.setData("text/plain", option.id)}
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const genreId = e.dataTransfer.getData("text/plain");
            if (!selectedGenres.includes(genreId) && selectedGenres.length < 3) {
              setSelectedGenres((prev) => [...prev, genreId]);
            }
          }}
        >
          {selectedGenres.map((genreId) => {
            const genreName = genreOptions.find((g) => g.id === genreId)?.name || "Unknown";
            return (
              <div key={genreId} className="selected-genre">
                {genreName}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedGenres((prev) => prev.filter((id) => id !== genreId))
                  }
                  className="remove-genre-button"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year Range Slider */}
      <div className="year-range-container">
        <label>
          Start Year:
          <input
            type="range"
            min="1900"
            max="2024"
            value={yearRange[0]}
            onChange={(e) => handleRangeChange(e, yearRange, setYearRange, 0)}
          />
        </label>
        <label>
          End Year:
          <input
            type="range"
            min="1900"
            max="2024"
            value={yearRange[1]}
            onChange={(e) => handleRangeChange(e, yearRange, setYearRange, 1)}
          />
        </label>
        <div>
          {yearRange[0]} - {yearRange[1]}
        </div>
      </div>

      {/* Runtime Range Slider */}
      <div className="runtime-range-container">
        <label>
          Min Runtime (minutes):
          <input
            type="range"
            min="0"
            max="360"
            step="10"
            value={runtimeRange[0]}
            onChange={(e) => handleRangeChange(e, runtimeRange, setRuntimeRange, 0)}
          />
        </label>
        <label>
          Max Runtime (minutes):
          <input
            type="range"
            min="0"
            max="360"
            step="10"
            value={runtimeRange[1]}
            onChange={(e) => handleRangeChange(e, runtimeRange, setRuntimeRange, 1)}
          />
        </label>
        <div>
          {Math.floor(runtimeRange[0] / 60)}h {runtimeRange[0] % 60}m -{" "}
          {Math.floor(runtimeRange[1] / 60)}h {runtimeRange[1] % 60}m
        </div>
      </div>

      {/* Language Selector */}
      <div className="language-selector-container">
        <label>
          Preferred Language:
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Find Movie Button */}
      <button
        type="button"
        className="find-movie-button"
        onClick={fetchRandomMovie}
        disabled={loading}
      >
        {loading ? "Loading..." : "Find Me a Movie"}
      </button>

      {/* Spinner */}
      {loading && <div className="spinner"></div>}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Movie Display */}
      {movie && (
        <div className="movie-container">
          <img className="movie-poster" src={movie.poster} alt={movie.title} />
          <div className="movie-title">{movie.title}</div>
          <div className="movie-genres">{movie.genres.join(", ")}</div>
          <div className="movie-release">Release Year: {movie.releaseYear}</div>
          {movie.runtime ? (
            <div className="movie-runtime">
              Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </div>
          ) : (
            <div className="movie-runtime">Runtime: Not Available</div>
          )}
          <div className="movie-language">
            <strong>Language:</strong> {movie.language}
          </div>
          <div className="movie-cast">
            <strong>Cast:</strong> {movie.cast.join(", ")}
          </div>
          <div className="movie-directors">
            <strong>Director(s):</strong> {movie.directors.join(", ")}
          </div>
          <div className="movie-producers">
            <strong>Producer(s):</strong> {movie.producers.join(", ")}
          </div>
          <div className="movie-synopsis">{movie.synopsis}</div>
        </div>
      )}
    </div>
  );
};

export default App;
