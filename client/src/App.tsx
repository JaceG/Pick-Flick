import * as React from "react";
import { useState } from "react";
import { getBaseUrl } from "./utils/getBaseUrl";
import axios from "axios";
import "./App.css";
import "./components/GenreButton/GenreButton.css";
import "./components/SelectedGenres/SelectedGenres.css";
import "./components/YearRangeSlider/YearRangeSlider.css";
import "./components/RuntimeRangeSlider/RuntimeRangeSlider.css";
import "./components/LanguageSelector/LanguageSelector.css";
import "./components/MovieDisplay/MovieDisplay.css";
import "./components/Spinner/Spinner.css";
import "./components/ErrorMessage/ErrorMessage.css";
import GenreButton from "./components/GenreButton/GenreButton.tsx";
import SelectedGenres from "./components/SelectedGenres/SelectedGenres.tsx";
import YearRangeSlider from "./components/YearRangeSlider/YearRangeSlider.tsx";
import RuntimeRangeSlider from "./components/RuntimeRangeSlider/RuntimeRangeSlider.tsx";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector.tsx";
import MovieDisplay from "./components/MovieDisplay/MovieDisplay.tsx";
import Spinner from "./components/Spinner/Spinner.tsx";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage.tsx";

const App: React.FC = () => {
  // State to store the fetched movie details
  const [movie, setMovie] = useState<{
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
  } | null>(null);

  // State to manage loading status
  const [loading, setLoading] = useState(false);
  // State to manage error messages
  const [error, setError] = useState<string | null>(null);

  // State to store selected genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // State to store the selected year range
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2020]);
  // State to store the selected runtime range
  const [runtimeRange, setRuntimeRange] = useState<[number, number]>([0, 360]); // Default runtime in minutes
  // State to store the selected language
  const [selectedLanguage, setSelectedLanguage] = useState<string>("any"); // Default to "Any"

  // Options for genres
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

  // Options for languages
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

  // Function to fetch a random movie based on selected filters
  const fetchRandomMovie = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const baseUrl = await getBaseUrl(); // Use the utility function
      const response = await axios.get(`${baseUrl}/api/movies/random`, {
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

  // Function to handle changes in range inputs (year and runtime)
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

  // Function to handle genre button clicks
  const handleGenreClick = (genreId: string) => {
    if (!selectedGenres.includes(genreId) && selectedGenres.length < 3) {
      setSelectedGenres((prev) => [...prev, genreId]);
    }
  };

  return (
    <div className="app">
      <h1>Random Movie Generator</h1>

      {/* Available Genres */}
      <div className="genres-container">
        {genreOptions.map((option) => (
          <GenreButton
            key={option.id}
            option={option}
            handleGenreClick={handleGenreClick}
          />
        ))}
      </div>

      {/* Selected Genres */}
      <SelectedGenres
        selectedGenres={selectedGenres}
        genreOptions={genreOptions}
        setSelectedGenres={setSelectedGenres}
      />

      {/* Year Range Slider */}
      <YearRangeSlider
        yearRange={yearRange}
        handleRangeChange={handleRangeChange}
        setYearRange={setYearRange}
      />

      {/* Runtime Range Slider */}
      <RuntimeRangeSlider
        runtimeRange={runtimeRange}
        handleRangeChange={handleRangeChange}
        setRuntimeRange={setRuntimeRange}
      />

      {/* Language Selector */}
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languageOptions={languageOptions}
      />

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
      {loading && <Spinner />}

      {/* Error Message */}
      {error && <ErrorMessage error={error} />}

      {/* Movie Display */}
      {movie && <MovieDisplay movie={movie} />}
    </div>
  );
};

export default App;
