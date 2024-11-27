import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Middleware for parsing JSON
app.use(express.json());

// TMDB genre mapping
const genreMap: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Route: Get a random movie
app.get('/api/movies/random', async (req, res) => {
  const { genre, releaseYear } = req.query;

  try {
    // TMDB API URL
    const tmdbUrl = 'https://api.themoviedb.org/3/discover/movie';

    // Parameters for TMDB API
    const params: { [key: string]: any } = {
      api_key: TMDB_API_KEY,
      language: 'en-US',
      sort_by: 'popularity.desc', // Sort by popularity
      page: Math.floor(Math.random() * 500) + 1, // Random page for variety
    };

    // Optional filters
    if (genre) params.with_genres = genre;
    if (releaseYear) params.primary_release_year = releaseYear;

    // Fetch movies from TMDB
    const response = await axios.get(tmdbUrl, { params });
    const movies = response.data.results;

    if (movies && movies.length > 0) {
      // Select a random movie
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];

      // Map genre_ids to genre names
      const genreNames = randomMovie.genre_ids.map((id: number) => genreMap[id] || 'Unknown');

      // Respond with movie details
      res.json({
        title: randomMovie.title,
        genres: genreNames, // Mapped genre names
        releaseYear: randomMovie.release_date.split('-')[0],
        synopsis: randomMovie.overview,
        poster: `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`, // Include poster
      });
    } else {
      res.status(404).json({ message: 'No movies found with the given filters' });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching movies:', error.message);
      res.status(500).json({ error: 'Failed to fetch movies', details: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Failed to fetch movies', details: 'Unknown error occurred' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
