import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { getBaseUrl } from "./utils/getBaseUrl";
import axios from "axios";
import "./App.css";
import GenreButton from "./components/GenreButton/GenreButton";
import SelectedGenres from "./components/SelectedGenres/SelectedGenres";
import YearRangeSlider from "./components/YearRangeSlider/YearRangeSlider";
import RuntimeRangeSlider from "./components/RuntimeRangeSlider/RuntimeRangeSlider";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import MovieDisplay from "./components/MovieDisplay/MovieDisplay";
import Spinner from "./components/Spinner/Spinner";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import AuthPage from "./components/Auth/AuthPage/AuthPage";

const App: React.FC = () => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2020]);
  const [runtimeRange, setRuntimeRange] = useState<[number, number]>([0, 360]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("any");

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

  const handleFetchMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = await getBaseUrl();
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
    } catch {
      setError("Failed to fetch a random movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Random Movie Generator</h1>
          <nav>
            {!loggedIn ? (
              <>
                <Link to="/auth/login" className="nav-button">
                  Login
                </Link>
                <Link to="/auth/register" className="nav-button">
                  Register
                </Link>
              </>
            ) : (
              <div className="logged-in-icon">
                <span>👤 Logged In</span>
                <button onClick={() => setLoggedIn(false)} className="logout-button">
                  Logout
                </button>
              </div>
            )}
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="genres-container">
                  {genreOptions.map((option) => (
                    <GenreButton
                      key={option.id}
                      option={option}
                      handleGenreClick={(genreId) =>
                        setSelectedGenres((prev) =>
                          prev.includes(genreId)
                            ? prev.filter((id) => id !== genreId)
                            : [...prev, genreId]
                        )
                      }
                      isSelected={selectedGenres.includes(option.id)}
                    />
                  ))}
                </div>
                <SelectedGenres
                  selectedGenres={selectedGenres}
                  genreOptions={genreOptions}
                  setSelectedGenres={setSelectedGenres}
                />
                <YearRangeSlider
                  yearRange={yearRange}
                  setYearRange={setYearRange}
                  handleRangeChange={handleRangeChange}
                />
                <RuntimeRangeSlider
                  runtimeRange={runtimeRange}
                  setRuntimeRange={setRuntimeRange}
                  handleRangeChange={handleRangeChange}
                />
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  languageOptions={[
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
                  ]}
                />
                {loading ? (
                  <Spinner />
                ) : (
                  <button
                    className="find-movie-button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFetchMovie();
                    }}
                  >
                    Find Me a Movie
                  </button>
                )}
                {error && <ErrorMessage message={error} />}
                {movie && <MovieDisplay movie={movie} />}
              </>
            }
          />
          <Route
            path="/auth/:type"
            element={<AuthPage onLogin={() => setLoggedIn(true)} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;