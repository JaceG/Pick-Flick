import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Optional: Add your own styling

const App: React.FC = () => {
  const [movie, setMovie] = useState<{
    title: string;
    genres: string[];
    releaseYear: string;
    synopsis: string;
    poster: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a random movie
  const fetchRandomMovie = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:3000/api/movies/random'); // Adjust to your backend URL
      setMovie(response.data);
    } catch (err) {
      setError('Failed to fetch a random movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Random Movie Generator</h1>
      <button className="random-button" onClick={fetchRandomMovie}>
        {loading ? 'Loading...' : 'Find Me a Movie'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {movie && (
        <div className="movie-container">
          <img className="movie-poster" src={movie.poster} alt={movie.title} />
          <div className="movie-title">{movie.title}</div>
          <div className="movie-genres">Genres: {movie.genres.join(', ')}</div>
          <div className="movie-release">Release Year: {movie.releaseYear}</div>
          <div className="movie-synopsis">{movie.synopsis}</div>
        </div>
      )}
    </div>
  );
};

export default App;
