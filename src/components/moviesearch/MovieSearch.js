import React, { useState } from "react";
import axios from "axios";
import './movieSearch.css'

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const API_KEY = "e8ccc676e299173067a80520c1fee405";
  const BASE_URL = "https://api.themoviedb.org/3/search/movie";

  const searchMovies = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          api_key: API_KEY,
          query: query,
        },
      });

      const sortedMovies = response.data.results.sort((a, b) => b.vote_average - a.vote_average);
      setMovies(sortedMovies);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setMovies([]);
    }
  };

  const handleSearch = () => {
    searchMovies();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  };

  return (
    <div className="moviesearch">
      <div className="searchbar">
        <h3>MOVIE NAME</h3>
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter movie name"
        />
        <button className="Search" onClick={handleSearch}>Search!</button>
      </div>

      {movies.length > 0 ? (
        <div className="movie-list">
          <div className="movie-cards">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div>
                  <div className="movie-details">
                    <h3>{movie.title}</h3>
                    <p>RELEASE DATE: {movie.release_date}</p>
                    <p>RATING: {movie.vote_average.toFixed(1)}</p>
                  </div>
                  <p>{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="not-found">No movies found with the given name.</p>
      )}
    </div>
  );
};

export default MovieSearch;
