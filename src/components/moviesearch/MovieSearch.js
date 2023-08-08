import React, { useState } from "react";
import axios from "axios";
import './movieSearch.css';

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating"); 
  const moviesPerPage = 5; 

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

      let sortedMovies = [...response.data.results];

      if (sortBy === "release_date") {
        sortedMovies = sortedMovies.sort((a, b) => {
          if (a.release_date && b.release_date) {
            return new Date(a.release_date) - new Date(b.release_date);
          } else if (!a.release_date) {
            return 1;
          } else {
            return -1;
          }
        });
      } else {
        sortedMovies = sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      }

      setMovies(sortedMovies);
      setCurrentPage(1); 
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    searchMovies();
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

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
        <div className="sort-options">
            <div className="sort-rating">
                <button
                    className={sortBy === "rating" ? "active" : ""}
                    onClick={() => handleSortChange("rating")}
                >
                    Sort by Rating
                </button>
            </div>
            <button
            className={sortBy === "release_date" ? "active" : ""}
            onClick={() => handleSortChange("release_date")}
            >
            Sort by Release Date
        </button>
      </div>
      </div>

      

      {currentMovies.length > 0 ? (
        <div className="movie-list">
          <div className="movie-cards">
            {currentMovies.map((movie) => (
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
          <div className="pagination">
            {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`pages ${currentPage === index + 1 ? "active" : ""}`}
              >
                {index + 1}
              </button>
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
