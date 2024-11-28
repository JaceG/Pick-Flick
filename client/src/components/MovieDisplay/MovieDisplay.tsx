import * as React from "react";

// Props interface defining the structure of the movie object
interface MovieDisplayProps {
  movie: {
    title: string;
    genres: string[];
    releaseYear: string;
    synopsis: string;
    poster: string;
    runtime: number;
    cast: string[];
    directors: string[];
    producers: string[];
    language: string;
  };
}

// Functional component to display movie details
const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie }) => {
  return (
    <div className="movie-container">
      <img className="movie-poster" src={movie.poster} alt={movie.title} /> {/* Poster image */}
      <div className="movie-title">{movie.title}</div> {/* Title */}
      <div className="movie-genres">{movie.genres.join(", ")}</div> {/* Genres */}
      <div className="movie-release">Release Year: {movie.releaseYear}</div> {/* Release year */}
      {movie.runtime ? (
        <div className="movie-runtime">
          Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m {/* Runtime in hours and minutes */}
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
      <div className="movie-synopsis">{movie.synopsis}</div> {/* Synopsis */}
    </div>
  );
};

export default MovieDisplay; // Export the component for use in other files
