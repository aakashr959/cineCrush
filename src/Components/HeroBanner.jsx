import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../css/HeroBanner.css';
import { getNowPlaying, getTrendingMovies } from '../services/api';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

export default function HeroBanner({ movies: propMovies, source = 'now_playing', limit = 6 }) {
  const [movies, setMovies] = useState(propMovies || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(!propMovies || propMovies.length === 0);
  const mountedRef = useRef(true);

  // Fetch live data if prop not provided or to refresh periodically
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      let data = [];
      if (source === 'trending') {
        data = await getTrendingMovies('week');
      } else {
        data = await getNowPlaying();
      }
      if (!mountedRef.current) return;
      // filter posters/backdrops
      const filtered = (data || []).filter(m => m && (m.backdrop_path || m.poster_path));
      setMovies(filtered.slice(0, limit));
      // preload images
      filtered.slice(0, limit).forEach(m => {
        const img = new Image();
        img.src = `${IMAGE_BASE}${m.backdrop_path || m.poster_path}`;
      });
      setLoading(false);
    } catch (err) {
      console.error('HeroBanner fetch error', err);
      setLoading(false);
    }
  }, [source, limit]);

  useEffect(() => {
    mountedRef.current = true;
    // if parent passed movies, use them but still refresh in background
    if (!propMovies || propMovies.length === 0) {
      fetchMovies();
    } else {
      setMovies(propMovies.slice(0, limit));
      setLoading(false);
      // preload
      propMovies.slice(0, limit).forEach(m => { const img = new Image(); img.src = `${IMAGE_BASE}${m.backdrop_path || m.poster_path}`; });
    }

    // polling to keep hero up-to-date (every 60s)
    const pollInterval = setInterval(() => {
      fetchMovies();
    }, 60000);

    return () => {
      mountedRef.current = false;
      clearInterval(pollInterval);
    };
  }, [propMovies, fetchMovies, limit]);

  const goToSlide = useCallback((index) => {
    if (!movies || movies.length === 0) return;
    setCurrentIndex(index < 0 ? movies.length - 1 : index % movies.length);
  }, [movies]);

  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  // Autoplay
  useEffect(() => {
    if (!isPaused && movies.length > 1) {
      const timer = setInterval(nextSlide, 5000); // 5s
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isPaused, nextSlide, movies.length]);

  if (loading) return null;
  if (!movies?.length) return null;

  const movie = movies[currentIndex];
  if (!movie) return null;

  const bg = movie.backdrop_path || movie.poster_path;
  const bgUrl = bg ? `${IMAGE_BASE}${bg}` : '';

  return (
    <section
      className="hero-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured movies"
      style={{ backgroundImage: `linear-gradient(to top, rgba(2,6,10,0.9), rgba(2,6,10,0.2)), url(${bgUrl})` }}
    >
      <button
        className="hero-nav prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        className="hero-nav next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-badge">prime</div>
          <h1 className="hero-title">{movie.title || movie.name}</h1>
          {movie.tagline && <p className="hero-tagline">{movie.tagline}</p>}
          <div className="hero-meta">
            <span className="hero-rank">#1 in India</span>
            <span className="hero-year">{movie.release_date?.split('-')[0]}</span>
          </div>

          <div className="hero-ctas">
            <button className="cta-primary">Join Prime · Watch now</button>
            <div className="cta-icons">
              <button className="circle">＋</button>
              <button className="circle">ⓘ</button>
            </div>
          </div>

          <p className="hero-sub">Watch with a Prime membership</p>
        </div>

        <div className="hero-spacer" aria-hidden />
      </div>

      <div className="hero-dots" role="tablist" aria-label="Slide dots">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === currentIndex}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
}
