import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "../css/MovieDetails.css";

const API_KEY = import.meta.env.VITE_MOVIE_APII_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function MovieDetails({ movieId, onClose }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(null);
  const [externalIds, setExternalIds] = useState(null);
  const [providers, setProviders] = useState(null);

  const handleBackToHome = () => {
    onClose(); // Close the modal first
    navigate('/'); // Then navigate to home
  };

  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      if (!API_KEY) {
        setError("Missing API key (VITE_MOVIE_APII_KEY)");
        setLoading(false);
        return;
      }

      try {
        // Fetch details, credits, external ids and watch providers in parallel
        const [detailsRes, creditsRes, idsRes, providersRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/movie/${movieId}/external_ids?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`),
        ]);

        if (!detailsRes.ok) throw new Error(`Details HTTP ${detailsRes.status}`);
        const detailsData = await detailsRes.json();

        const creditsData = creditsRes.ok ? await creditsRes.json() : null;
        const idsData = idsRes.ok ? await idsRes.json() : null;
        const providersData = providersRes.ok ? await providersRes.json() : null;

        if (mounted) {
          setDetails(detailsData);
          setCredits(creditsData);
          setExternalIds(idsData);
          setProviders(providersData);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        if (mounted) setError("Failed to load movie details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetails();

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      mounted = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [movieId, onClose]);

  if (!movieId) return null;

  return createPortal(
    <div className="details-overlay" onClick={onClose}>
      <div className="details-container" onClick={(e) => e.stopPropagation()}>
        <div className="details-header-controls">
          <button className="details-home" onClick={handleBackToHome}>← Back to Home</button>
          <button className="details-close" onClick={onClose}>✖</button>
        </div>

        {loading && <div className="details-loading">Loading details…</div>}
        {error && <div className="details-error">{error}</div>}

        {details && (
          <div className="details-content">
            {/* Backdrop with overlay */}
            {details.backdrop_path && (
              <div className="details-backdrop">
                <img src={`${IMAGE_BASE}${details.backdrop_path}`} alt={details.title} />
                <div className="backdrop-overlay"></div>
              </div>
            )}

            <div className="details-main">
              {/* Header section with poster and main info */}
              <div className="details-header">
                <div className="movie-poster-large">
                  {details.poster_path && <img src={`${IMAGE_BASE}${details.poster_path}`} alt={details.title} />}
                </div>
                <div className="movie-header-info">
                  <h1 className="details-title">
                    {details.title} 
                    <span className="details-year">({details.release_date?.split("-")[0]})</span>
                  </h1>
                  <p className="details-tagline">{details.tagline}</p>
                  
                  <div className="quick-info">
                    <span className="rating">★ {details.vote_average?.toFixed(1)}</span>
                    <span className="runtime">{details.runtime ? `${Math.floor(details.runtime/60)}h ${details.runtime%60}m` : "N/A"}</span>
                    <span className="release">{new Date(details.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <div className="genres">
                    {details.genres?.map(g => (
                      <span key={g.id} className="genre-tag">{g.name}</span>
                    ))}
                  </div>

                  <div className="details-actions">
                    {externalIds?.imdb_id && (
                      <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} 
                         target="_blank" 
                         rel="noreferrer"
                         className="imdb-button">
                        IMDb
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Overview section */}
              <section className="details-section">
                <h3>Overview</h3>
                <p className="details-overview">{details.overview}</p>
              </section>

              {/* Cast section in horizontal scroll */}
              {credits && credits.cast?.length > 0 && (
                <section className="details-section">
                  <h3>Top Cast</h3>
                  <div className="cast-scroll">
                    {credits.cast.slice(0, 12).map(c => (
                      <div key={c.cast_id || c.credit_id} className="cast-item">
                        {c.profile_path ? 
                          <img src={`${IMAGE_BASE}${c.profile_path}`} alt={c.name} /> : 
                          <div className="cast-placeholder">
                            <span>{c.name.charAt(0)}</span>
                          </div>
                        }
                        <div className="cast-name">{c.name}</div>
                        <div className="cast-role">{c.character}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Additional info in a grid */}
              <div className="details-grid-info">
                <section className="details-section">
                  <h3>Movie Info</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Status</label>
                      <span>{details.status}</span>
                    </div>
                    <div className="info-item">
                      <label>Original Language</label>
                      <span>{details.original_language?.toUpperCase()}</span>
                    </div>
                    <div className="info-item">
                      <label>Budget</label>
                      <span>{details.budget ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(details.budget) : 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Revenue</label>
                      <span>{details.revenue ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(details.revenue) : 'N/A'}</span>
                    </div>
                  </div>
                </section>

                {credits && credits.crew?.length > 0 && (
                  <section className="details-section">
                    <h3>Featured Crew</h3>
                    <div className="crew-grid">
                      {['Director', 'Producer', 'Writer', 'Music', 'Cinematography'].map(role => {
                        const members = credits.crew.filter(mem => mem.job === role);
                        if (members.length === 0) return null;
                        return (
                          <div key={role} className="crew-item">
                            <label>{role}</label>
                            <span>{members.map(m => m.name).join(', ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Streaming section */}
                {providers && providers.results && (
                  <section className="details-section">
                    <h3>Where to Watch</h3>
                    {(() => {
                      const region = providers.results['US'] ? 'US' : Object.keys(providers.results)[0];
                      const info = providers.results[region];
                      if (!info) return <div>Not available for streaming</div>;
                      return (
                        <div className="watch-options">
                          {info.flatrate && (
                            <div className="watch-category">
                              <label>Stream</label>
                              <div className="provider-list">
                                {info.flatrate.map(p => <span key={p.provider_id} className="provider">{p.provider_name}</span>)}
                              </div>
                            </div>
                          )}
                          {info.rent && (
                            <div className="watch-category">
                              <label>Rent</label>
                              <div className="provider-list">
                                {info.rent.map(p => <span key={p.provider_id} className="provider">{p.provider_name}</span>)}
                              </div>
                            </div>
                          )}
                          {info.buy && (
                            <div className="watch-category">
                              <label>Buy</label>
                              <div className="provider-list">
                                {info.buy.map(p => <span key={p.provider_id} className="provider">{p.provider_name}</span>)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </section>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default MovieDetails;