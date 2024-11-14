// TMDB API setup
const apiKey = "YOUR_API_KEY"; // Replace 'YOUR_API_KEY' with your actual API key

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// Function to fetch popular movies on page load
async function fetchPopularMovies() {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("Error fetching popular movies:", err);
  }
}

// Event listener for search input
document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value;
  if (query.length >= 3) {
    fetchMovies(query);
  }
});

// Fetch movies based on search query
async function fetchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("Error fetching search results:", err);
  }
}

// Display movies in grid
function displayMovies(movies) {
  const moviesGrid = document.getElementById("movies-grid");
  moviesGrid.innerHTML = ""; // Clear previous results
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date}</p>
      <button onclick="showMovieDetails(${movie.id})">More Details</button>
    `;
    moviesGrid.appendChild(movieCard);
  });
}

// Show movie details in modal
async function showMovieDetails(movieId) {
  const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`;
  const response = await fetch(detailsUrl, {
    method: "GET",
    headers: { accept: "application/json" },
  });
  const movie = await response.json();

  document.getElementById("movie-title").innerText = movie.title;
  document.getElementById("movie-synopsis").innerText = movie.overview;
  document.getElementById("movie-rating").innerText = movie.vote_average;
  document.getElementById(
    "movie-runtime"
  ).innerText = `${movie.runtime} minutes`;
  document.getElementById("movie-cast").innerText = movie.credits.cast
    .slice(0, 5)
    .map((c) => c.name)
    .join(", ");

  document.getElementById("movie-modal").style.display = "block";

  // Store current movie ID for adding to watchlist
  document
    .getElementById("add-to-watchlist")
    .setAttribute("data-movie-id", movie.id);
}

// Close modal
function closeModal() {
  document.getElementById("movie-modal").style.display = "none";
}

// Add movie to watchlist
function addToWatchlist() {
  const movieId = document
    .getElementById("add-to-watchlist")
    .getAttribute("data-movie-id");
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Movie added to watchlist!");
  } else {
    alert("Movie is already in the watchlist.");
  }
}

// Fetch popular movies when the page loads
document.addEventListener("DOMContentLoaded", fetchPopularMovies);
