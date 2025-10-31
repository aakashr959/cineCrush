import MovieCard from "../Components/MovieCard";
import HeroBanner from "../Components/HeroBanner";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/Home.css";
import { searchMovies, getPopularMovies } from "../services/api"

function Home() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Load popular movies or perform a search when `q` query param changes
    useEffect(() => {
        const q = new URLSearchParams(location.search).get('q') || '';

        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
                setError(null);
            } catch (err) {
                setError("Failed to load movies...");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        const performSearch = async (query) => {
            if (!query.trim()) return loadPopularMovies();
            setLoading(true);
            try {
                const searchResults = await searchMovies(query);
                setMovies(searchResults || []);
                setError(null);
            } catch (err) {
                setError("Failed to search movies...");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        // If q param exists, run search; otherwise load popular movies
        if (q) {
            performSearch(q);
        } else {
            loadPopularMovies();
        }
    }, [location.search]);

    return (
        <div className = "home">
            {error && <div className = "error-message"> {error} </div>}

            {loading ? (
                <div className = "loading"> Loading...</div> 
            ) : (
            <>
                {/* Hero carousel: use first 5 movies */}
                {movies.length > 0 && <HeroBanner movies={movies.slice(0, 5)} />}

                <div className="movies-grid">
                    {/* Skip the first 5 movies since they're in the hero */}
                    {movies.slice(5).map(movie => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </>
            )}
        </div>
    );
}

export default Home