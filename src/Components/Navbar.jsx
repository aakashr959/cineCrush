import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        // Navigate to home with query param so Home performs the search
        navigate(`/?q=${encodeURIComponent(q)}`);
        // keep query in the input
    };

    return (
        <header className="navbar">
            <div className="nav-left">
                <Link to="/" className="navbar-brand">
                    <span className="word-one">cine</span>
                    <span className="word-two">Crush</span>
                </Link>
            </div>

            <nav className="nav-center" aria-label="Primary">
                <ul className="nav-list">
                    <li>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/movies" className="nav-link">
                            Movies
                        </Link>
                    </li>
                    <li>
                        <Link to="/tv" className="nav-link">
                            TV Shows
                        </Link>
                    </li>
                    <li>
                        <Link to="/My Activity" className="nav-link">
                            My Activity
                        </Link>
                    </li>
                    <li>
                        <Link to="/favourites" className="nav-link">
                            Favourites
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="nav-right">
                <form className="navbar-search" onSubmit={onSubmit} role="search">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search for movies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search movies"
                    />
                    <button type="submit" className="search-button" aria-label="Search">
                        🔍
                    </button>
                </form>

                <div className="nav-actions">
                    
                    <button className="avatar-btn" aria-label="Profile">
                        <span className="avatar">A</span>
                    </button>
                    <Link to="/join" className="join-btn">
                        Premium
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;