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

// Mapping of language codes to full names
const languageMap: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  zh: "Chinese",
  fr: "French",
  de: "German",
  hi: "Hindi",
  ar: "Arabic",
  ru: "Russian",
  pt: "Portuguese",
  ja: "Japanese",
  // Add more language mappings as needed
};

// Functional component to display movie details
const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie }) => {
  const languageFullName = languageMap[movie.language] || movie.language;

  return (
    <div className="movie-container">
      <img
        className="movie-poster"
        src={movie.poster || PlaceholderPoster}
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
        <div className="movie-language">
          <p><strong>Language:</strong> {languageFullName}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDisplay; // Export the component for use in other files
