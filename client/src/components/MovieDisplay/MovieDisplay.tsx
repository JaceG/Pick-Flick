import * as React from "react";
import PlaceholderPoster from "../../../../assets/img/placeholder.jpg";

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
      <img
        className="movie-poster"
        src={movie.poster || PlaceholderPoster }
        alt={movie.poster ? `Movie poster for ${movie.title}` : `Placeholder for ${movie.title}`}
      />
      <div className="movie-details">
        <h2 className="movie-title">{movie.title}</h2>
        <div className="movie-meta">
          <p className="movie-genres">{movie.genres.join(", ")}</p>
          <p className="movie-release">Release Year: {movie.releaseYear}</p>
        </div>
        <div className="movie-runtime">
          Runtime: {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "Not Available"}
        </div>
        <div className="movie-synopsis">
          <p><strong>Synopsis:</strong> {movie.synopsis}</p>
        </div>
        <div className="movie-credits">
          <p><strong>Cast:</strong> {movie.cast.join(", ")}</p>
          <p><strong>Director(s):</strong> {movie.directors.join(", ")}</p>
          <p><strong>Producer(s):</strong> {movie.producers.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};


export default MovieDisplay; // Export the component for use in other files
