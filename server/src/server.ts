import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS for frontend access
app.use(
  cors({
    origin: ["http://localhost:3000", "https://pick-flick-app.netlify.app"], // Add Netlify URL
    methods: ["GET", "POST"],
  })
);

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
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const nameToIdMap: { [key: string]: number } = Object.entries(genreMap).reduce(
  (acc, [id, name]) => ({ ...acc, [name.toLowerCase()]: Number(id) }),
  {}
);

const fetchMovies = async (params: any, maxRetries = 3): Promise<any[]> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`TMDB API request parameters (attempt ${attempt + 1}):`, params);
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params });
      console.log('TMDB API response:', response.data);

      if (response.data.results.length > 0) {
        return response.data.results;
      }
      params.page = Math.floor(Math.random() * response.data.total_pages) + 1;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching movies from TMDB:', error.message);
      } else {
        console.error('Unexpected error during movie fetch:', error);
      }
    }
  }
  return [];
};

// Route: Get a random movie
app.get('/api/movies/random', async (req, res) => {
  const { genre, startYear, endYear, minRuntime, maxRuntime, language } = req.query;

  try {
    const params: { [key: string]: any } = {
      api_key: TMDB_API_KEY,
      language: language || 'en-US',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 500) + 1,
    };

    // Process genres
    if (genre) {
      const genreIds = genre
        .toString()
        .split(',')
        .map((g) => g.trim())
        .map((g) => nameToIdMap[g.toLowerCase()] || g)
        .filter((g) => !isNaN(Number(g)));
      if (genreIds.length > 0) {
        params.with_genres = genreIds.join(',');
      } else {
        return res.status(400).json({ error: `Invalid genres provided: ${genre}` });
      }
    }

    // Add year range filters
    if (startYear && isNaN(Number(startYear))) {
      return res.status(400).json({ error: 'Start year must be a valid number.' });
    }
    if (endYear && isNaN(Number(endYear))) {
      return res.status(400).json({ error: 'End year must be a valid number.' });
    }
    if (startYear && endYear && Number(startYear) > Number(endYear)) {
      return res.status(400).json({ error: 'Start year cannot be greater than end year.' });
    }
    if (startYear) params['primary_release_date.gte'] = `${startYear}-01-01`;
    if (endYear) params['primary_release_date.lte'] = `${endYear}-12-31`;

    // Add runtime filters
    if (minRuntime && isNaN(Number(minRuntime))) {
      return res.status(400).json({ error: 'Minimum runtime must be a valid number.' });
    }
    if (maxRuntime && isNaN(Number(maxRuntime))) {
      return res.status(400).json({ error: 'Maximum runtime must be a valid number.' });
    }
    if (minRuntime) params['with_runtime.gte'] = Number(minRuntime);
    if (maxRuntime) params['with_runtime.lte'] = Number(maxRuntime);

    // Add language filter
    if (language) {
      params.with_original_language = language;
    }

    const movies = await fetchMovies(params);

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];

      // Fetch additional movie details
      const movieDetails = await axios.get(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${TMDB_API_KEY}&language=${language || 'en-US'}&append_to_response=credits`
      );

      const genreNames = randomMovie.genre_ids.map((id: number) => genreMap[id] || 'Unknown');
      const cast = movieDetails.data.credits.cast.slice(0, 5).map((actor: any) => actor.name); // Top 5 actors
      const directors = movieDetails.data.credits.crew
        .filter((crewMember: any) => crewMember.job === 'Director')
        .map((director: any) => director.name);
      const producers = movieDetails.data.credits.crew
        .filter((crewMember: any) => crewMember.job === 'Producer')
        .map((producer: any) => producer.name);

      res.json({
        title: randomMovie.title,
        genres: genreNames,
        releaseYear: randomMovie.release_date.split('-')[0],
        synopsis: randomMovie.overview,
        poster: randomMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`
          : null,
        runtime: movieDetails.data.runtime || 0, // Include runtime
        cast,
        directors,
        producers,
        language: randomMovie.original_language,
      });
    } else {
      console.log('No movies found for the given filters.');
      res.status(404).json({ message: 'No movies found for the given filters.' });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching movies:', error.message);
      res.status(500).json({ error: 'Failed to fetch movies.', details: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Failed to fetch movies.', details: 'Unknown error occurred.' });
    }
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
