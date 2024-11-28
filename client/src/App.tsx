import React, { useState } from 'react';
import axios from 'axios'; // Importing axios for making HTTP requests
import './App.css';

const App: React.FC = () => {
  // State to store the fetched movie details
  const [movie, setMovie] = useState<{
    title: string;
    genres: string[];
    releaseYear: string;
    synopsis: string;
    poster: string;
  } | null>(null);

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  // State to manage error messages
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a random movie
  const fetchRandomMovie = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    try {
      // Make a GET request to fetch a random movie
      const response = await axios.get('http://localhost:3000/api/movies/random'); // Adjust to your backend URL
      setMovie(response.data); // Set the fetched movie data to state
    } catch (err) {
      // Set error message if the request fails
      setError('Failed to fetch a random movie. Please try again.');
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="app">
      <h1>Random Movie Generator</h1>
      {/* Button to fetch a random movie, disabled while loading */}
      <button className="random-button" onClick={fetchRandomMovie} disabled={loading}>
        {loading ? 'Loading...' : 'Find Me a Movie'} {/* Show loading text if loading */}
      </button>

      {/* Display loading spinner if loading */}
      {loading && <div className="spinner"></div>}

      {/* Display error message if there is an error */}
      {error && <div className="error-message">{error}</div>}

      {/* Display movie details if a movie is fetched */}
      {movie && (
        <div className="movie-container">
          <img className="movie-poster" src={movie.poster} alt={movie.title} /> {/* Movie poster */}
          <div className="movie-title">{movie.title}</div> {/* Movie title */}
          <div className="movie-genres">Genres: {movie.genres.join(', ')}</div> {/* Movie genres */}
          <div className="movie-release">Release Year: {movie.releaseYear}</div> {/* Movie release year */}
          <div className="movie-synopsis">{movie.synopsis}</div> {/* Movie synopsis */}
        </div>
      )}
    </div>
  );
};

export default App; // Exporting the App component as default
