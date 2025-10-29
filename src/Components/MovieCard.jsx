import React, { useState, useRef, useEffect } from "react";
import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({movie}) {
    const {isFavourite, addToFavourites, removeFromFavourites} = useMovieContext();
    const favourite = isFavourite(movie.id);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
    const trailerContainerRef = useRef(null);
    // Read API key from Vite env (local `.env` not committed). If you need
    // to run locally, create a `.env` file with VITE_MOVIE_APII_KEY=your_key
    const API_KEY = import.meta.env.VITE_MOVIE_APII_KEY;

    // CORRECTION: Change the URL to the YouTube embed format for the iframe
    const fetchTrailer = async () => {
        // Open a popup as a fallback (opened synchronously so popup blockers
        // allow it) — we'll navigate it to YouTube if fullscreen isn't usable
        // (useful on some mobile browsers that don't allow iframe fullscreen).
        let popup = null;
        try {
            popup = window.open('', '_blank');
            if (popup) popup.document.write('<p style="color:#fff;background:black;padding:20px;">Loading trailer…</p>');
        } catch {
            popup = null;
        }

        // Start showing the overlay and request fullscreen immediately
        // so the browser sees the action as a user gesture.
        try {
            // Request fullscreen on the whole document element so the overlay
            // we render fills the screen. If the browser denies it, we'll
            // continue without fullscreen.
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) await docEl.requestFullscreen();
            else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
        } catch (err) {
            // requestFullscreen may fail or be blocked; ignore and continue
            console.warn("Could not enter fullscreen:", err);
        }

        setShowTrailer(true);
        setTrailerUrl(null);
        setIsLoadingTrailer(true);

        const url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const trailer = data.results.find(
                (vid) => vid.site === "YouTube" && vid.type === "Trailer"
            );

            if (trailer) {
                // Use the YouTube embed format and include autoplay
                const embedUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
                setTrailerUrl(embedUrl);

                // If fullscreen wasn't entered (some mobile browsers don't
                // allow the parent to fullscreen or the request was blocked),
                // fall back to opening the trailer in the popup/tab we created
                // (so the user can use YouTube's native fullscreen controls).
                const isFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
                if (!isFull && popup) {
                    try {
                        popup.location.href = `https://www.youtube.com/watch?v=${trailer.key}`;
                        // close our overlay since the popup will handle playback
                        setShowTrailer(false);
                        setTrailerUrl(null);
                    } catch {
                        // if navigation fails, keep the overlay
                    }
                    return;
                }
            } else {
                alert("No trailer found for this movie.");
                // close the overlay if none found
                closeTrailer();
            }
            // close popup if we didn't use it
            if (popup && !popup.closed) {
                try { popup.close(); } catch { /* ignore */ }
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
            closeTrailer();
        } finally {
            setIsLoadingTrailer(false);
        }
    };

    const closeTrailer = async () => {
        setShowTrailer(false);
        setTrailerUrl(null);
        setIsLoadingTrailer(false);
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
        } catch (err) {
            console.warn("Error exiting fullscreen:", err);
        }
    };

    // Prevent background scroll while overlay is open and try to prefer
    // requesting fullscreen on the overlay container when it becomes available.
    useEffect(() => {
        if (showTrailer) {
            document.body.style.overflow = 'hidden';
            // Try to request fullscreen on the overlay container when available.
            // This may fail or be blocked depending on browser rules; we already
            // attempted a document-level fullscreen request in the click handler.
            try {
                const el = trailerContainerRef.current;
                if (el && el.requestFullscreen) {
                    el.requestFullscreen().catch(() => {});
                }
            } catch {
                /* ignore */
            }
        } else {
            document.body.style.overflow = '';
        }

        return () => { document.body.style.overflow = ''; };
    }, [showTrailer]);


    function onFavouriteClick(evnt) {
        evnt.preventDefault()
        if(favourite){
            removeFromFavourites (movie.id);
        }
        else{
            addToFavourites(movie);
        }
    }
    
    return (
        <div className="movie-card"> 
            <div className="movie-poster">
                <img src = {`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt = {movie.title} />
                <div className="movie-overlay">
                    <button className = {`favourite-btn ${favourite ? "active" : ""}`} onClick = {onFavouriteClick}> &#x2665; </button>
                </div>
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie_releasedate">{movie.release_date?.split("-")[0]}</p>
                <h3>{movie.title}</h3>

            <button onClick={fetchTrailer}>Watch Trailer</button>

            {showTrailer && (
                <div className="trailer-overlay" onClick={closeTrailer}>
                    <div className="trailer-container" ref={trailerContainerRef} onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeTrailer}>✖</button>
                        {isLoadingTrailer && (
                            <div style={{color: 'white', textAlign: 'center'}}>Loading trailer…</div>
                        )}
                        {!isLoadingTrailer && trailerUrl && (
                            <iframe 
                                width="100%"
                                height="100%"
                                src={trailerUrl}
                                title="YouTube trailer"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>
            )}
            </div>
        
        </div>
    )
}

export default MovieCard;