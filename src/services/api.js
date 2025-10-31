// Read TMDB API key from Vite environment variables.
// Keep the secret out of source control by adding it to a local `.env` file
// (see `.env.example`) and ensuring `.env` is listed in `.gitignore`.
const API_KEY = import.meta.env.VITE_MOVIE_APII_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
    console.warn("VITE_MOVIE_APII_KEY is not set. Create a local .env file with this variable (see .env.example).");
}

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results || [];
};

export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results || [];
};

export const getNowPlaying = async () => {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    return data.results || [];
};

export const getTrendingMovies = async (timeWindow = 'week') => {
    // timeWindow can be 'day' or 'week'
    const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results || [];
};


